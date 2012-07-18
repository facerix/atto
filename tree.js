//
// tree.js (Atto Tree : convert a raw list of DOM nodes into a simple treeview widget)
//
// author: Ryan Corradini
// date: 18 July 2012
// license: MIT
//

"use strict";

aw._loadResource('css', 'awTree.css', 'css-tree');

// declare the aw.Tree widget
aw.Tree = function(rootNode, optArgs) {
    var _root  = rootNode || document.createElement('div'),
        _currNode = null,
        i         = 0,
        nd        = null,
        nCount    = _root.childNodes.length,
        lastId    = 0,
        _registry = {},
        options   = optArgs,
        currTitle = null,
        currNode  = null,
        __frag    = document.createDocumentFragment(),
        nodeCount = 0;

    function _getUniqueId() {
        var newVal = 'tree-node-' + lastId++;
        _registry[newVal] = newVal;
        return newVal;
    }

    function _addNode(id, label, appendTo) {
        var sID     = id,
            ndTitle = null,
            ndPane  = null,
            ndChild = null;

        appendTo = appendTo || _root;
        sID = id || _getUniqueId();
        nodeCount += 1;
        ndTitle = document.createElement('div');
        ndTitle.className = 'title';
        ndTitle.innerHTML = label;

        appendTo.appendChild(ndTitle);

        ndPane = document.createElement('div');
        ndPane.className = 'pane';
        ndPane.id = sID;
        ndPane.innerHTML = content;
        ndTitle.onclick = function(ndTarget) {
            return function() {
                if (_currNode != ndTarget) {
                    _currNode.classList.remove('active');
                    _currNode = this;
                }
                ndTarget.classList.toggle('active');
                this.classList.toggle('active');
            }
        }(ndPane);

        appendTo.appendChild(ndPane);
        if (nodeCount==1) {
            _currentTitle = ndTitle;
            _currNode = ndPane;
            ndTitle.classList.add('active');
            ndPane.classList.add('active');
        }
    }


    // grab any child elements (not raw text nodes) to form my initial tabs
    for (i=0; i<nCount; i++) {
        if (_root.childNodes[i].nodeType == ELEMENT_NODE) {
            nd = _root.childNodes[i];

            _addNode(nd.title ? nd.title : "Node " + (nodeCount+1), nd.innerHTML, __frag);
        }
    }
    _root.innerHTML = '';
    _root.classList.add('tree');
    _root.appendChild(__frag);


    return {
        "root"    : _root,
        "addNode" : _addNode
    }
}
