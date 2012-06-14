//
// Atto Core : helper functions and such (AMD)
//
// author: Ryan Corradini
// version: 2.0
// date: 12 June 2012
// license: MIT
//


// polyfill classList if necessary (seriously, IE9? Seriously?!?)
//   source: http://purl.eligrey.com/github/classList.js/blob/master/classList.js
if(typeof document!=="undefined"&&!("classList" in document.createElement("a"))){(function(j){var a="classList",f="prototype",m=(j.HTMLElement||j.Element)[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.className),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.className=this.toString()}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(o){o+="";if(g(this,o)===-1){this.push(o);this._updateClassName()}};e.remove=function(p){p+="";var o=g(this,p);if(o!==-1){this.splice(o,1);this._updateClassName()}};e.toggle=function(o){o+="";if(g(this,o)===-1){this.add(o)}else{this.remove(o)}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};

define(
    function() {

        function _xhr(args) {
            var opts = _args_mixin({
                url: '',
                postData: '',
                success: null,
                failure: null
            }, args);

            var req = _createXMLHTTPObject();
            if (!req) return;
            if (opts.postData) {
                req.open('POST', opts.url, true);
                req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
            } else {
                req.open('GET', opts.url, true);
            }
            req.onreadystatechange = function () {
                if (req.readyState != 4) return;
                if (req.status != 200 && req.status != 304) {
                    //alert('HTTP error ' + req.status);
                    if (opts.failure && typeof opts.failure === 'function') {
                        //console.debug(opts.failure);
                        opts.failure.call(this,req);
                    }
                    return;
                }
                if (opts.success && typeof opts.success === 'function') {

                    opts.success.call(this, req.response || req.responseText);
                }
            }
            if (req.readyState == 4) return;
            req.send(opts.postData);
        }

        var _XMLHttpFactories = [
            function () {return new XMLHttpRequest()},
            function () {return new ActiveXObject("Msxml2.XMLHTTP")},
            function () {return new ActiveXObject("Msxml3.XMLHTTP")},
            function () {return new ActiveXObject("Microsoft.XMLHTTP")}
        ];

        function _createXMLHTTPObject() {
            var xmlhttp = false;
            for (var i=0; i < _XMLHttpFactories.length; i++) {
                try {
                    xmlhttp = _XMLHttpFactories[i]();
                }
                catch (e) {
                    continue;
                }
                break;
            }
            return xmlhttp;
        }

        function _isArray(it) {
            // shamelessly lifted from Dojo Base)
            return it && (it instanceof Array || typeof it === "array");
        }

        function _colonSplit(s) {
            return s ? s.split(':') : null;
        }

        function _parse_args(arglist) {
            var args = [];
            if (arglist) {
                if (typeof arglist === 'string') {
                    args = arglist.split(',').map(String.trim).map(_colonSplit); // split by comma, trim whitespace, then split by colon
                } else if (_isArray(arglist)) {
                    args = arglist.map(_colonSplit);
                } else if (typeof arglist === 'object') {
                    for (var k in arglist) {
                        args.push([k, arglist[k]]);
                    }
                }
            }
            return args;
        }

        function _args_mixin(old_args, new_arglist) {
            var new_args = _parse_args(new_arglist), key, val;
            for (var i in new_args) {
                key = new_args[i][0];
                val = new_args[i][1];
                old_args[key] = val;
            }
            return old_args;
        }  // --> this is the one that gets exposed

        function _stopEventCascade(e) {
            if (!e) var e = window.event;
            if (e.preventDefault) {
                e.preventDefault();
            } else if (e.stop) {
                e.stop();
            } else {
                e.cancelBubble = true;
            }

            e.returnValue = false;
            if (e.stopPropagation) e.stopPropagation();
        }

        function _addLoadEvent(func) {
        /*
          Simon Willison's unobtrusive onLoad event handler
          (http://simonwillison.net/2004/May/26/addLoadEvent/)

          Example usage:
            atto.addLoadEvent(nameOfSomeFunctionToRunOnPageLoad);
            atto.addLoadEvent(function() {
              // more code to run on page load
            });
        */
            var oldonload = window.onload;
            if (typeof window.onload != 'function') {
                window.onload = func;
            } else {
                window.onload = function() {
                    if (oldonload) {
                        oldonload();
                    }
                    func();
                }
            }
        }

        function _addEvent(tgt, type, func, useCapture) {
        // follows the API of the standard addEventListener, but abstracts it to work cross-browser
            var capture = useCapture || false;
            if (tgt.addEventListener) {
                // modern standards-based browsers
                tgt.addEventListener(type, func, capture);
            } else if (tgt.attachEvent) {
                // IE < 9
                tgt.attachEvent('on'+type, func);
            } else if (typeof tgt['on'+type] !== 'undefined') {
                // old school (can assign to the element's event handler this way, provided it's not undefined)
                var oldfunc = tgt['on'+type];
                if (typeof oldfunc === 'function') {
                    tgt['on'+type] = function() { oldfunc(); func(); };
                } else {
                    tgt['on'+type] = func;
                }
            } else {
                alert ("Can't add this event type: " + type + " to this element: " + tgt);
            }
        }

        function _byId(id) {
        // convenience shortcut; no real improvement other than code shorthand
            return document.getElementById(id);
        }

        function _supplant(str, args) {
        /*
          adapted from Douglas Crockford's Remedial JavaScript
          Example usage:
            alert(atto.supplant("I'm {age} years old!", { age: 29 }));
            alert(atto.supplant("The {a} says {n}, {n}, {n}!", { a: 'cow', n: 'moo' }));
        */
            return str.replace(/{([^{}]*)}/g,
                function (a, b) {
                    var r = args[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
            );
        };

        return {
            addLoadEvent     : _addLoadEvent,
            addEvent         : _addEvent,
            byId             : _byId,
            stopEventCascade : _stopEventCascade,
            xhrRequest       : _xhr,
            mixinArgs        : _args_mixin,
            supplant         : _supplant
        }
    }
);
