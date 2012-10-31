//
// Atto Tree : convert a raw list of DOM nodes into a simple treeview widget
//
// author: Ryan Corradini
// date: 25 Oct 2012
// license: MIT
//

define(
    ["atto/core","atto/lmnt","atto/tao","require"],
    function(atto, lmnt, tao) {
        // make sure the appopriate CSS has been loaded for this widget
        var forWidget = "atto-tree";
        if (!document.querySelector("style[data-for-widget='"+forWidget+"']")) {
            require(["text!atto/tree.css"], function(rawCss) { atto.addWidgetCss(rawCss, forWidget); });
        }

        function constructor(rootNode, optArgs) {
            var _root  = rootNode || document.createElement('ul'),
                _currNode = null,
                i         = 0,
                nd        = null,
                nCount    = _root.childElementCount || lmnt.childElementCount(_root),
                lastId    = 0,
                _registry = {},
                options   = optArgs || {},
                __frag    = document.createDocumentFragment(),
                nodeCount = 0;

            function _getUniqueId() {
                var newVal = 'tree-node-' + lastId++;
                _registry[newVal] = newVal;
                return newVal;
            }

            function _addNode_old(label, content, appendTo) {
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

            function _convertExistingNode(srcNode) {
                var newNode, expando, label,
                    i, grandchildren, lastChild, clickSrc;

                srcNode.className = 'aw-treeNode';

                // create the expando & label elements
                label = tao.create("span.label{" + (srcNode.title || "Unnamed Node") + "}");
                expando = tao.create("a.aw-expando{ }");
                expando.href = "#";

                // handle differently if this is a leaf node (i.e. no child elements)
                if (lmnt.childElementCount(srcNode)) {
                    // has children

                    srcNode.insertBefore(label, lmnt.firstElementChild(srcNode));
                    srcNode.insertBefore(expando, label);

                    // is the last child an UL? If not, assume we're childless
                    lastChild = lmnt.lastElementChild(srcNode)
                    if (lastChild.tagName != 'UL') {
                        // last element child isn't an UL; assume that means there isn't one, and we're empty
                        srcNode.classList.add('empty');

                        srcNode.appendChild(expando);
                        srcNode.appendChild(label);

                    } else {
                        lastChild.classList.add('aw-treeNodeList');

                        // last element child IS an UL; recurse its children
                        grandchildren = lmnt.children(lastChild);
                        for (i in grandchildren) {
                            _convertExistingNode(grandchildren[i]);
                        }
                    }

                } else {
                    //srcNode has no child elements; create a new UL to go after the expando & label

                    srcNode.classList.add('empty');
                    srcNode.appendChild(expando);
                    srcNode.appendChild(label);
                    srcNode.appendChild(document.createElement('ul'));
                }

                atto.addEvent(srcNode, 'click', function(e) {
                    clickSrc = e.target || e.srcElement;
                    if (clickSrc) {
                        clickSrc.parentNode.classList.toggle('open');
                        atto.stopEventCascade(e);
                    }
                }, false);
            }

            if (_root.tagName == 'UL') {
                // try and convert any existing structure into a Tree if at all possible

                // grab any child elements (not raw text nodes) to form my initial nodes
                var elems = lmnt.children(_root);
                for (i=0; i < elems.length; i++) {
                    _convertExistingNode(elems[i]);
                }

            } else {
                // replace the existing DOM node with a proper UL and go from there
                _root.appendChild(tao.zen("div#aw-treeNode>a.aw-expando{ }+span.label{Branch 1}+div.aw-treeNodeList>div.aw-treeNode+div.aw-treeNode"));

            }

            _root.classList.add('aw-tree');
            _root.appendChild(__frag);

            return {
                root    : _root,
                addNode : function() {}
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
