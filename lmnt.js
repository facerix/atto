// polyfill ElementTraversal interfaces in older browsers
//
// LMNT version 2.0 (AMD)
// author: Ryan Corradini

define(
    function() {
        // some browsers don't define this constant, which most of the widget bootstraps rely on
        var ELEMENT_NODE = document.ELEMENT_NODE || 1;

        function _nextElementSibling( el ) {
            if ( el && el.nextElementSibling ) { return el.nextElementSibling; }
            if ( !el ) { return null; }
            do { el = el.nextSibling } while ( el && el.nodeType !== ELEMENT_NODE );
            return el;
        }

        function _previousElementSibling( el ) {
            if ( el && el.previousElementSibling ) { return el.previousElementSibling; }
            if ( !el ) { return null; }
            do { el = el.previousSibling } while ( el && el.nodeType !== ELEMENT_NODE );
            return el;
        }

        function _firstElementChild( el ) {
            if ( el && el.firstElementChild ) { return el.firstElementChild; }
            el = el ? el.firstChild : null;
            if ( el && el.nodeType == ELEMENT_NODE ) {
                return el;
            } else {
                return el.nextElementSibling || _nextElementSibling(el);
            }
        }

        function _lastElementChild( el ) {
            if ( el && el.lastElementChild ) { return el.lastElementChild; }
            el = el ? el.lastChild : null;
            if ( el && el.nodeType == ELEMENT_NODE ) {
                return el;
            } else {
                return el.previousElementSibling || _previousElementSibling(el);
            }
        }

        function _childElementCount( el ) {
            // note that we can't use el.children because IE<9 lies, including comment nodes.
            if ( el && el.childElementCount ) { return el.childElementCount; }
            var count = 0;
            el = el ? el.firstChild : null;
            while ( el ) {
                if ( el && el.nodeType == ELEMENT_NODE ) { count++; }
                el = el.nextSibling;
            };
            return count;
        }

        function _childElements( el ) {
            // see above; can't trust el.children, so we have to do it manually no matter what.
            var stash = [];
            el = el ? el.firstChild : null;
            while ( el ) {
                if ( el && el.nodeType == ELEMENT_NODE ) { stash.push( el ); }
                el = el.nextSibling;
            };
            return stash;
        }

        return {
            nextElementSibling     : _nextElementSibling,
            previousElementSibling : _previousElementSibling,
            firstElementChild      : _firstElementChild,
            lastElementChild       : _lastElementChild,
            childElementCount      : _childElementCount,
            children               : _childElements
        }
    }
);