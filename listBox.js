//
// Atto ListBox : convert a raw list of DOM nodes into a simple list widget
//
// author: Ryan Corradini
// date: 6 July 2012
// license: MIT
//

define(
    ["atto/core","atto/lmnt","atto/event","require"],
    function(atto, lmnt, CustomEvent) {
        // make sure the appopriate CSS has been loaded for this widget
        var forWidget = "atto-listbox";
        if (!document.querySelector("style[data-for-widget='"+forWidget+"']")) {
            require(["text!atto/listBox.css"], function(rawCss) { atto.addWidgetCss(rawCss, forWidget); });
        }

        function constructor(rootNode, optArgs) {
            var _root  = rootNode,
                _currentItem = null,
                i      = 0,
                nd     = null,
                nCount = _root.childElementCount || lmnt.childElementCount(_root),
                lastId = 0,
                _registry = {},
                options = optArgs,
                _events = {
                    itemSelected: new CustomEvent('atto.listBox.itemSelected')
                };

            // temporary working vars
            var __frag    = document.createDocumentFragment(),
                itemCount = 0;

            function _getUniqueId() {
                var newVal = 'aw-list-item-' + lastId++;
                _registry[newVal] = newVal;
                return newVal;
            }

            function _addItem(id, label, appendTo) {
                var sID     = '',
                    ndItem  = null;

                appendTo = appendTo || _root;
                sID = id || _getUniqueId();
                itemCount += 1;

                ndItem = document.createElement('li');
                ndItem.className = 'aw-listitem';
                ndItem.id = sID;
                ndItem.innerHTML = label;
                ndItem.onclick = function() {
                    return function() {
                        if (_currentItem != this) {
                            _currentItem.classList.remove('selected');
                            _currentItem = this;
                            this.classList.add('selected');
                            _events.itemSelected.dispatch({
                                item: this.id
                            });
                        }
                    }
                }();

                appendTo.appendChild(ndItem);
                if (itemCount==1) {
                    _currentItem = ndItem;
                    ndItem.classList.add('selected');
                }
            }


            // grab any child elements (not raw text nodes) to form my initial tabs
            var elems = lmnt.children(_root);
            for (i=0; i<nCount; i++) {
                nd = elems[i];

                _addItem(nd.id, nd.innerHTML, __frag);
            }

            // ensure we've got a malleable container node (ul, not select or p or...)
            if (_root && _root.nodeName != 'UL') {
                var newRoot = document.createElement('ul');
                newRoot.id = _root.id;
                newRoot.className = _root.className;
                _root.parentElement.replaceChild(newRoot, _root);
                _root = newRoot;
            }

            _root.innerHTML = '';
            _root.classList.add('aw-listbox');
            _root.appendChild(__frag);


            return {
                root        : _root,
                addItem     : _addItem,
                events      : _events,
                currentItem : function() { return _currentItem; }
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
