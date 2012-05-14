//
// awVPanel.js (AttoWidget VPanel : simple vertical-layout widget)
//
// author: Ryan Corradini
// version: 1.0
// date: 9 May 2012
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
        nCount = _root.childNodes.length,
        opts   = optArgs;

    //_root.innerHTML = '';
    _root.classList.add('aw-vPanel');

    // massage the child nodes
    if (_root.childElementCount < 3) {
        // if less than 3 child elements, we'll need to divine which is which, or create them from scratch
    } else {
        // grab the first three child elements for head/main/foot
        _head = _root.firstElementChild  ||  firstElementChild(_root);
        _main = _head.nextElementSibling || nextElementSibling(_head);
        _foot = _main.nextElementSibling || nextElementSibling(_main);
    }

    // set classes & inline sizing accordingly
    if (_head) {
        _head.classList.add('header');
        _head.style.height = opts.header || '15%';
        if (_main) {
            _main.style.top = _head.style.height;
        }
    }
    _main && _main.classList.add('center');
    if (_foot) {
        _foot.classList.add('footer');
        _foot.style.height = opts.footer || '10%';
        if (_main) {
            _main.style.bottom = _foot.style.height;
        }
    }

    return {
        "root"   : _root,
        "header" : _head,
        "center" : _main,
        "footer" : _foot
    }
}