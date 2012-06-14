//
// Atto VPanel : simple vertical-layout widget
//
// author: Ryan Corradini
// version: 2.0 (AMD)
// date: 14 Jun 2012
// license: MIT
//

define(
    ["atto/core","atto/lmnt"], //,"text!awVPanel.css"],
    function(atto, lmnt) {
        function constructor(rootNode, optionArray) {
            var _root  = rootNode || document.createElement('div'),
                _head  = null,
                _main  = null,
                _foot  = null,
                i      = 0,
                nd     = null,
                nCount = _root.childElementCount || lmnt.childElementCount(_root),
                opts   = optionArray || {};

            //_root.innerHTML = '';
            _root.classList.add('aw-vPanel');

            // massage the child nodes
            if (nCount !== 3) {
                // if more or less than 3 child elements, we'll need to divine which is which (or create them from scratch...?)
                if (opts.headerId) {
                    nd = atto.byId(opts.headerId);
                    if (nd) {
                        _head = nd;
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
                if (opts.footerId) {
                    nd = atto.byId(opts.footerId);
                    if (nd) {
                        _foot = nd;
                        if (nd.parentNode !== _root) {
                            _root.appendChild(nd);
                        }
                    }
                }
            } else {
                // grab the first three child elements for head/main/foot
                _head = _root.firstElementChild  || lmnt.firstElementChild(_root);
                _main = _head.nextElementSibling || lmnt.nextElementSibling(_head);
                _foot = _main.nextElementSibling || lmnt.nextElementSibling(_main);
            }

            // set classes & inline sizing accordingly
            if (_head) {
                _head.classList.add('header');
                _head.style.height = opts.header || '15%';
                if (_main) _main.style.top = _head.style.height;
            } else {
                if (_main) _main.style.top = '0';
            }
            _main && _main.classList.add('center');
            if (_foot) {
                _foot.classList.add('footer');
                _foot.style.height = opts.footer || '10%';
                if (_main) _main.style.bottom = _foot.style.height;
            } else {
                if (_main) _main.style.bottom = '0';
            }

            return {
                root   : _root,
                header : _head,
                center : _main,
                footer : _foot
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
