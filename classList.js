//
// Atto ClassList : functional classList polyfill/wrapper for Element.className (should work even in ancient IEs)
//
// author: Ryan Corradini (with some reference to http://purl.eligrey.com/github/classList.js/blob/master/classList.js)
// date: 1 Nov 2012
// license: MIT
//

define(
    function() {
        "use strict";

        function _inArray(the_array, searchElement) {
            if (the_array == null) {
              throw new TypeError();         
            }
            var t = Object(the_array);
            var len = t.length >>> 0;
            if (len === 0) {
              return -1;
            }         
            var n = 0;
            if (arguments.length > 2) {
              n = Number(arguments[2]);
              if (n != n) { // shortcut for verifying if it's NaN                 
                n = 0;
              } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n)); 
              }         
            }
            if (n >= len) {
              return -1;
            }         
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) { 
              if (k in t && t[k] === searchElement) {
                return k;
              }         
            }
          return -1;     
        }

      
        return function(el) {
            var _err = function(o,p) { this.name=o; this.code=DOMException[o]; this.message=p; this.toString=function(){return o + ": " + p} }
            if (!el) { throw new _err("NULL_ERR","A null element was specified"); }
            var _el = el,
                _arr = [];

            function _update() {
                _el.className = _toString();
            }

            function _add(cls) {
                if (!_contains(cls)) {
                    _arr.push(cls);
                    _update();
                }
            }

            function _contains(cls) {
                return (_inArray(_arr, cls) !== -1);
            }

            function _item(idx) {
                return _arr[idx] || null;
            }

            function _length() {
                return _arr.length;
            }

            function _remove(val) {
                var cls = val+"",
                    pos = _inArray(_arr, val);
                if (pos !== -1) {
                    _arr.splice(pos, 1);
                    _update();
                }
            }

            function _toggle(cls) {
                if (_inArray(_arr, cls) === -1) {
                    _add(cls);
                } else {
                    _remove(cls);
                }
            }

            function _toString() {
                return _arr.join(' ');
            }

            return {
                add      : _add,
                contains : _contains,
                item     : _item,
                length   : _arr.length,
                remove   : _remove,
                toggle   : _toggle,
                toString : _toString
            }
        }
    }
);
