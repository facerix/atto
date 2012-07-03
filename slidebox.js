//
// Atto SlideBox : converts a raw list of DOM nodes into a simple slideshow widget
//
// author: Ryan Corradini
// version: 2.0 (AMD)
// date: 13 Jun 2012
// license: MIT
//

define(
    ["atto/core","atto/lmnt","require"],
    function(atto, lmnt) {
        // make sure the appopriate CSS has been loaded for this widget
        var forWidget = "atto-slideBox";
        if (!document.querySelector("style[data-for-widget='"+forWidget+"']")) {
            require(["text!atto/slideBox.css"], function(rawCss) { atto.addWidgetCss(rawCss, forWidget); });
        }

        function constructor(rootNode, optionArray) {
            var _root   = rootNode || document.createElement('div'),
                _slides = [],
                _curr   = 0,
                i       = 0,
                nd      = 0,
                opts    = optionArray || {},
                nCount  = _root.childElementCount || lmnt.childElementCount(_root);

            // grab any child elements (not raw text nodes) to form the initial slides for our deck
            var elems = lmnt.children(_root);
            for (i=0; i<nCount; i++) {
                nd = elems[i];
                nd.setAttribute('data-baseClasses', nd.className + ' aw-slide ');
                nd.className = nd.className + ' aw-slide next';
                _slides.push(nd);
            }

            // add the appropriate class to the root node
            _root.classList.add('aw-slidebox');

            // prev link
            nd = document.createElement('a');
            nd.className = 'aw-prev-button';
            nd.innerHTML = '&#x2039;';
            nd.onclick = function(tgt) {
                return function(e) {
                    atto.stopEventCascade(e);
                    slides_prev();
                    return false;
                }
            }(this);
            _root.appendChild(nd);

            // next link
            nd = document.createElement('a');
            nd.className = 'aw-next-button';
            nd.innerHTML = '&#x203A;';
            nd.onclick = function(tgt) {
                return function(e) {
                    atto.stopEventCascade(e);
                    slides_next();
                    return false;
                }
            }(this);
            _root.appendChild(nd);


            // make slide #0 visible
            _setSlideState(0, 'current');


            // helper function to make the class munging less messy
            //  (classList can't help because it doesn't have a 'replace' method,
            //  and we need to add & remove at the same time to make the transition look right)
            function _setSlideState(index, state) {
                var nd = _slides[index],
                    baseClasses = '';
                if (nd) {
                    baseClasses = nd.getAttribute('data-baseClasses');
                    nd.className = baseClasses + state;
                }
            }

            // now define the common operations:
            function slides_goto(index) {
                var i = 0;
                if ((index != _curr) &&
                    (index >= 0) &&
                    (index < _slides.length)) {

                    if (index < _curr) {
                        for (i=index+1; i<=_curr; i++) {
                            _setSlideState(i, 'next');
                        }
                        //_setSlideState(_curr, 'next');
                    } else {
                        for (i=_curr; i<index; i++) {
                            _setSlideState(i, 'prev');
                        }
                        //_setSlideState(_curr, 'prev');
                    }

                    _curr = index;
                    _setSlideState(index, 'current');
                }
            }

            function slides_next() {
                if (_curr < _slides.length-1) {
                    _setSlideState(_curr, 'prev');

                    _curr++;
                    _setSlideState(_curr, 'current');
                }
            }

            function slides_prev() {
                if (_curr > 0) {
                    _setSlideState(_curr, 'next');

                    _curr--;
                    _setSlideState(_curr, 'current');
                }
            }

            return {
                "root":   _root,
                "slides": _slides,
                "currentSlide": _curr,
                "goto":   slides_goto,
                "next":   slides_next,
                "prev":   slides_prev
            } // end of public interface
        } // end of constructor


        return constructor;
    } // end function
);
