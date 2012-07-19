//
// Atto Tree : convert a raw list of DOM nodes into a simple treeview widget
//
// author: Ryan Corradini
// date: 18 July 2012
// license: MIT
//

define(
    ["atto/core","atto/lmnt","require"],
    function(atto, lmnt) {
        // make sure the appopriate CSS has been loaded for this widget
        var forWidget = "atto-tree";
        if (!document.querySelector("style[data-for-widget='"+forWidget+"']")) {
            require(["text!atto/tree.css"], function(rawCss) { atto.addWidgetCss(rawCss, forWidget); });
        }

        function constructor(rootNode, optArgs) {
            var _root  = rootNode || document.createElement('div'),
                _currNode = null,
                i         = 0,
                nd        = null,
                nCount    = _root.childElementCount || lmnt.childElementCount(_root),
                lastId    = 0,
                _registry = {},
                options   = optArgs || {},
                currTitle = null,
                currNode  = null,
                __frag    = document.createDocumentFragment(),
                nodeCount = 0;

            function _getUniqueId() {
                var newVal = 'tree-node-' + lastId++;
                _registry[newVal] = newVal;
                return newVal;
            }

            function _addNode(label, content, appendTo) {
                var sID     = '',
                    ndTitle = null,
                    ndPane  = null,
                    ndChild = null;

                appendTo = appendTo || _root;
                sID = _getUniqueId();
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
            var elems = lmnt.children(_root);
            for (i=0; i<nCount; i++) {
                nd = elems[i];
                _addNode(nd.title ? nd.title : "Node " + (nodeCount+1), nd.innerHTML, __frag);
            }
            _root.innerHTML = '';
            _root.classList.add('aw-tree');
            _root.appendChild(__frag);


            return {
                "root"    : _root,
                "addNode" : _addNode
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
