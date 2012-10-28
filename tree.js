//
// Atto Tree : convert a raw list of DOM nodes into a simple treeview widget
//
// author: Ryan Corradini
// date: 25 Oct 2012
// license: MIT
//

define(
    ["atto/core","atto/lmnt","atto/event","require"],
    function(atto, lmnt, AttoEvent) {
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
                _events   = {
                    itemSelected: new AttoEvent('atto.listBox.itemSelected')
                },
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

            function _addNode(srcNode) {
                var newNode, expando, label;

                //newNode = document.createElement('li');
                srcNode.className = 'aw-treeNode';

                // insert the expando & label elements for each list item
                expando = document.createElement('a');
                expando.href = "#";
                expando.className = "aw-expando";
                expando.appendChild(document.createTextNode(" "));

                label = document.createElement('span');
                label.className = 'label';
                label.appendChild(document.createTextNode(srcNode.title || "Unnamed Node"));

                // handle differently if this is a leaf node (i.e no child elements)
                if (lmnt.childElementCount(srcNode)) {
                    // has children

                    srcNode.insertBefore(label, lmnt.firstElementChild(srcNode));
                    srcNode.insertBefore(expando, label);


                    // is the last child an UL? If not, assume we're childless

                    var grandchildren, lastChild = lmnt.lastElementChild(srcNode)
                    if (lastChild.tagName != 'UL') {
                        // last element child isn't an UL; assume that means there isn't one, and we're empty
                        srcNode.classList.add('empty');

                        srcNode.appendChild(expando);
                        srcNode.appendChild(label);

                    } else {
                        // last element child IS an UL; recurse its children
                        grandchildren = lmnt.children(lastChild);
                        for (var i in grandchildren) {
                            _addNode(grandchildren[i]);
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
                    var clickSrc = e.target || e.srcElement;
                    if (clickSrc) {
                        clickSrc.parentNode.classList.toggle('open');
                        atto.stopEventCascade(e);
                    }
                }, false);

                //__frag.appendChild(newNode);

            }

            // grab any child elements (not raw text nodes) to form my initial nodes

            // prototype //
            /*
            var lis = document.querySelectorAll('#myTree li');
            for (var i=0; i<lis.length; i++) {
                lis[i].className = 'aw-treeNode';
                if (lmnt.childElementCount(lis[i]) && lmnt.children(lis[i]).slice(-1)[0].tagName != 'UL') {
                    lis[i].classList.add('empty');
                }
                atto.addEvent(lis[i], 'click', function(e) {
                    var clickSrc = e.target || e.srcElement;
                    if (clickSrc) {
                        clickSrc.parentNode.classList.toggle('open');   // closed
                        atto.stopEventCascade(e);
                    }
                }, false);
            }
            */
            // end of prototype //

            var elems = lmnt.children(_root);
            for (i=0; i < elems.length; i++) {
                _addNode(elems[i]);

                //_addNode(nd.title ? nd.title : "Node " + (nodeCount+1), nd.innerHTML, __frag);
            }
            //_root.innerHTML = '';
            _root.classList.add('aw-tree');
            _root.appendChild(__frag);

            return {
                root    : _root
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
