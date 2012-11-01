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
                return (_arr.indexOf(cls) !== -1);
            }

            function _item(idx) {
                return _arr[idx] || null;
            }

            function _length() {
                return _arr.length;
            }

            function _remove(val) {
                var cls = val+"",
                    pos = _arr.indexOf(val);
                if (pos !== -1) {
                    _arr.splice(pos, 1);
                    _update();
                }
            }

            function _toggle(cls) {
                if (_arr.indexOf(cls)===-1) {
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
