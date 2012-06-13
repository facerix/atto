//
// Atto Core : helper functions and such (AMD)
//
// author: Ryan Corradini
// version: 2.0
// date: 12 June 2012
// license: MIT
//

"use strict";

define(
    function() {

        function _lastScriptPath() {
            var path = null,
                script_sources = document.querySelectorAll('script[src]');
            if (script_sources) {
                path = script_sources[script_sources.length-1].src;
            }

            return path ? path.substr(0,path.lastIndexOf('/')+1) : null;
        }

        function _loadResource(type, url, id) {
            var fileRef = null;

            // if url doesn't include an explicit path, assume the most recently loaded script file's path
            //  (which for Attowidgets that load their own stylesheets is a pretty safe assumption!)
            if (url.indexOf('/') == -1) {
                url = _lastScriptPath() + url;
            }

            if (type === 'css') {
                fileRef = document.createElement('link');
                fileRef.setAttribute("rel", "stylesheet");
                fileRef.setAttribute("type", "text/css");
                fileRef.setAttribute("href", url);

            } else if (type === 'js') {
                fileRef = document.createElement('script');
                fileRef.setAttribute("type", "text/javascript");
                fileRef.setAttribute("src", url);

            } else {
                // handle error state
            }

            if (fileRef) {
                if (id) { fileRef.setAttribute("id", id); }
                fileRef.onload = function(m) {
                    //console.log('loaded:', m);
                };
                document.querySelector('head').appendChild(fileRef);
            }

            return fileRef;
        }

        function _loadTemplate(url, id) {
            var fileRef = document.createElement('iframe');
            fileRef.setAttribute("style", "display:none");
            fileRef.setAttribute("id", id);
            fileRef.setAttribute("src", url);
            document.querySelector('body').appendChild(fileRef);
        }

        // --------------------------------------------------------------------

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
            aw.core.addLoadEvent(nameOfSomeFunctionToRunOnPageLoad);
            aw.core.addLoadEvent(function() {
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
            alert(aw.core.supplant("I'm {age} years old!", { age: 29 }));
            alert(aw.core.supplant("The {a} says {n}, {n}, {n}!", { a: 'cow', n: 'moo' }));
        */
            return str.replace(/{([^{}]*)}/g,
                function (a, b) {
                    var r = args[b];
                    return typeof r === 'string' || typeof r === 'number' ? r : a;
                }
            );
        };

        return {
            _lastScriptPath: _lastScriptPath,
            _loadResource  : _loadResource,
            _loadTemplate  : _loadTemplate,

            core           : {
                addLoadEvent     : _addLoadEvent,
                addEvent         : _addEvent,
                byId             : _byId,
                stopEventCascade : _stopEventCascade,
                xhrRequest       : _xhr,
                mixinArgs        : _args_mixin,
                supplant         : _supplant
            }
        }
    }
);
