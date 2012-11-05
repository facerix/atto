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
                _lastId   = 0,
                _registry = {},
                options   = optArgs || {},
                nodeCount = 0;

            function _getUniqueId() {
                var newVal = 'tree-node-' + _lastId++;
                _registry[newVal] = newVal;
                return newVal;
            }

            function _addNode(details, parentNode) {
                var sID = details.id || _getUniqueId(),
                    newNode = tao.create("li.aw-treeNode.empty#" + sID),
                    nodeTitle = details.label || 'Node ' + _lastId,
                    appendTo, contentFrag;

                contentFrag = tao.expand("a.aw-expando{ }+span.label{" + nodeTitle + "}+ul.aw-treeNodeList");
                newNode.appendChild(contentFrag);

                atto.addEvent(newNode, 'click', _toggleNodeOpen, false);
                if (parentNode) {
                    if (parentNode.classList.contains('aw-tree') || parentNode.classList.contains('aw-treeNodeList')) {
                        // this is a valid container
                        appendTo = parentNode;
                    } else {
                        // try to find the nearest valid container inside the specified parent node
                        appendTo = parentNode.querySelector('.aw-treeNodeList');
                        if (parentNode.classList.contains('empty')) parentNode.classList.remove('empty');
                    }
                }
                if (appendTo) {
                    appendTo.appendChild(newNode);
                } else {
                    // no parent specified, or I couldn't find a valid container within
                    //   the specified parent; append to the root
                    _root.appendChild(newNode);
                }
                return newNode;
            }

            function _convertExistingNode(srcNode) {
                var newNode, expando, label,
                    i, grandchildren, lastChild, clickSrc;

                srcNode.className = 'aw-treeNode';

                // create the expando & label elements
                label = tao.create("span.label{" + (srcNode.title || "Unnamed Node") + "}");
                expando = tao.create("a.aw-expando{ }[href=#]");

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

                atto.addEvent(srcNode, 'click', _toggleNodeOpen, false);
            }

            function _toggleNodeOpen(e) {
                clickSrc = e.target || e.srcElement;
                if (clickSrc) {
                    clickSrc.parentNode.classList.toggle('open');
                    atto.stopEventCascade(e);
                }
            }

            if (_root.tagName == 'UL') {
                // try and convert any existing structure into a Tree if at all possible

                // grab any child elements (not raw text nodes) to form my initial nodes
                var i, elems = lmnt.children(_root);
                for (i=0; i < elems.length; i++) {
                    _convertExistingNode(elems[i]);
                }

            } else {
                // flush any existing content & add the barebones plumbing
                _root.innerHTML = '';

                // TBD: if user provided a node tree as part of opts, walk that tree and build its nodes
            }

            _root.classList.add('aw-tree');

            return {
                root    : _root,
                addNode : _addNode
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
