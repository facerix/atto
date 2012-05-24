//
// awVPanel.js (AttoWidget VPanel : simple vertical-layout widget)
//
// author: Ryan Corradini
// version: 1.1
// date: 23 May 2012
// license: MIT
//

"use strict";

aw._loadResource('css', 'awVPanel.css', 'css-vpanel');

// declare the aw.VPanel widget
aw.VPanel = function(rootNode, optArgs) {
    var _root  = rootNode || document.createElement('div'),
        _head  = null,
        _main  = null,
        _foot  = null,
        i      = 0,
        nd     = null,
        nCount = _root.childElementCount || lmnt.childElementCount(_root),
        opts   = optArgs || {};

    //_root.innerHTML = '';
    _root.classList.add('aw-vPanel');

    // massage the child nodes
    if (nCount !== 3) {
        // if more or less than 3 child elements, we'll need to divine which is which (or create them from scratch...?)
        if (opts.headerId) {
            nd = aw.core.byId(opts.headerId);
            if (nd) {
                _head = nd;
                if (nd.parentNode !== _root) {
                    _root.appendChild(nd);
                }
            }
        }
        if (opts.centerId) {
            nd = aw.core.byId(opts.centerId);
            if (nd) {
                _main = nd;
                if (nd.parentNode !== _root) {
                    _root.appendChild(nd);
                }
            }
        }
        if (opts.footerId) {
            nd = aw.core.byId(opts.footerId);
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
        "root"   : _root,
        "header" : _head,
        "center" : _main,
        "footer" : _foot
    }
}