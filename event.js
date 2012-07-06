//
// Atto Event : Object-based variation on a lightweight Pub/Sub module
//                 based loosely on:
//                    Addy Osmani's pubsubz: https://github.com/addyosmani/pubsubz/blob/master/pubsubz.js
//                  and
//                    Peter Higgins' bloody jQuery plugns: https://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js
//
// author: Ryan Corradini
// date: 6 July 2012
// license: MIT
//

define(
    function() {
        function constructor(name) {

            // private defs & methods

            var _name = name,
                _subscribers = {},
                _lastUid = 0;

            /**
             *  Dispatch the event with the provided context to all subscribed callbacks
             *  @contextData:  The data to pass to subscribers
            **/
            function _pub( contextData ){
                for ( var m in _subscribers ){
                    if ( _subscribers.hasOwnProperty( m ) ){
                        _subscribers[m]( contextData || {} );
                    }
                }
                return true;
            };

            /**
             *  Add the passed callback function to the subscriber list for the provided topic.
             *  Returns: Unique subscription ID, which can be used to unsubscribe
             *  @callback: The callback function to invoke when the provided topic is published
            **/
            function _sub( callback ){
                var id = (++_lastUid).toString();
                _subscribers[id] = callback;

                // return ID for unsubscribing
                return id;
            };

            /**
             *  Unsubscribes a specific subscriber from a specific topic using the unique ID
             *  @id: The ID of the function to unsubscribe
            **/
            function _unsub( id ){
                if ( _subscribers.hasOwnProperty(id) ) {
                    delete _subscribers[id];
                    return true;
                }
                return false;
            };


            // public interface
            return {
                name     : _name,
                dispatch : _pub,
                watch    : _sub,
                unwatch  : _unsub
            } // end of public interface
        } // end of constructor

        return constructor;

    } // end of require func
); // end of atto/pubsub
