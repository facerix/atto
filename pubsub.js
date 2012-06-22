//
// Atto PubSub : Just another lightweight Pub/Sub module
//                 based loosely on:
//                    Addy Osmani's pubsubz: https://github.com/addyosmani/pubsubz/blob/master/pubsubz.js
//                  and
//                    Peter Higgins' bloody jQuery plugns: https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
//
// author: Ryan Corradini
// version: 1.0
// date: 22 June 2012
// license: MIT
//

define(
    function() {

        // private defs & methods

        var topic_cache = {},
            lastUid = -1;

        /**
         *  Publish the specified topic, passing the provided data to all subscriber callbacks
         *  @topic: The topic to publish
         *  @data:  The data to pass to subscribers
        **/
        function _pub( topic, data ){
            var subscribers = topic_cache[topic],
                len = subscribers && subscribers.length ? subscribers.length : 0;
            setTimeout(function notify(){
                while( len-- ){
                    subscribers[len].func( topic, data || [] );
                }
            }, 0 );
            return true;
        };

        /**
         *  Add the passed callback function to the subscriber list for the provided topic.
         *  Returns: Unique subscription ID, which can be used to unsubscribe
         *  @topic: The topic to subscribe to
         *  @callback: The callback function to invoke when the provided topic is published
        **/
        function _sub( topic, callback ){
            // init subscriber list for this topic if necessary
            if ( !topic_cache.hasOwnProperty( topic ) ){
                topic_cache[topic] = [];
            }
            var id = (++lastUid).toString();
            topic_cache[topic].push( { id : id, func : callback } );

            // return ID for unsubscribing
            return id;
        };

        /**
         *  Unsubscribes a specific subscriber from a specific topic using the unique ID
         *  @id: The ID of the function to unsubscribe
        **/
        function _unsub( id ){
            for ( var m in topic_cache ){
                if ( topic_cache.hasOwnProperty( m ) ){
                    for ( var i = 0, j = topic_cache[m].length; i < j; i++ ){
                        if ( topic_cache[m][i].id === id ){
                            topic_cache[m].splice( i, 1 );
                            return true;
                        }
                    }
                }
            }
            return false;
        };


        // public interface
        return {
            publish     : _pub,
            subscribe   : _sub,
            unsubscribe : _unsub
        } // end of public interface
    }
); // end of atto/pubsub
