//
// Atto HPanel : simple horizontal-layout widget
//
// author: Ryan Corradini
// version: 2.1
// date: 3 July 2012
// license: MIT
//

define(
    ["atto/core","atto/lmnt","require"],
    function(atto, lmnt) {
        // make sure the appopriate CSS has been loaded for this widget
        var cssTitle = "atto-hpanel";
        if (!document.querySelector("style[data-for-widget='"+cssTitle+"']")) {
            require(["text!atto/hPanel.css"], function(rawCss) {
                var newCss = document.createElement('style');
                newCss.setAttribute('data-for-widget', cssTitle);
                newCss.type = "text/css";
                newCss.textContent = rawCss;

                document.head.appendChild(newCss);
            });
        }

        function constructor(rootNode, optionArray) {
            var _root  = rootNode || document.createElement('div'),
                _left  = null,
                _main  = null,
                _right = null,
                i      = 0,
                nd     = null,
                nCount = _root.childElementCount || lmnt.childElementCount(_root),
                opts   = optionArray || {};

            //_root.innerHTML = '';
            _root.classList.add('aw-hPanel');

            // massage the child nodes
            if (nCount !== 3) {
                // if more or less than 3 child elements, we'll need to divine which is which (or create them from scratch...?)
                if (opts.leftId) {
                    nd = atto.byId(opts.leftId);
                    if (nd) {
                        _left = nd;
                        if (nd.parentNode !== _root) {
                            _root.appendChild(nd);
                        }
                    }
                }
                if (opts.centerId) {
                    nd = atto.byId(opts.centerId);
                    if (nd) {
                        _main = nd;
                        if (nd.parentNode !== _root) {
                            _root.appendChild(nd);
                        }
                    }
                }
                if (opts.rightId) {
                    nd = atto.byId(opts.rightId);
                    if (nd) {
                        _right = nd;
                        if (nd.parentNode !== _root) {
                            _root.appendChild(nd);
                        }
                    }
                }
            } else {
                // grab the first three child elements for left/main/right
                _left  = _root.firstElementChild  || lmnt.firstElementChild(_root);
                _main  = _left.nextElementSibling || lmnt.nextElementSibling(_left);
                _right = _main.nextElementSibling || lmnt.nextElementSibling(_main);
            }

            // set classes & inline sizing accordingly
            if (_left) {
                _left.classList.add('left');
                _left.style.width = opts.left || '15%';
                if (_main) _main.style.left = _left.style.width;
            } else {
                if (_main) _main.style.left = '0';
            }
            _main && _main.classList.add('center');
            if (_right) {
                _right.classList.add('right');
                _right.style.width = opts.right || '10%';
                if (_main) _main.style.right = _right.style.width;
            } else {
                if (_main) _main.style.right = '0';
            }

            return {
                root   : _root,
                left   : _left,
                center : _main,
                right  : _right
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
