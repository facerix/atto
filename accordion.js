//
// Atto Accordion : convert a raw list of DOM nodes into a simple accordion widget
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
        var cssTitle = "atto-accordion";
        if (!document.querySelector("style[data-for-widget='"+cssTitle+"']")) {
            require(["text!atto/accordion.css"], function(rawCss) {
                var newCss = document.createElement('style');
                newCss.setAttribute('data-for-widget', cssTitle);
                newCss.type = "text/css";
                newCss.textContent = rawCss;

                document.head.appendChild(newCss);
            });
        }

        function constructor(rootNode, optionArray) {
            var _root  = rootNode || document.createElement('div'),
                _currentTitle = null,
                _currentPanel = null,
                i      = 0,
                nd     = null,
                nCount = _root.childElementCount || lmnt.childElementCount(_root),
                lastId = 0,
                _registry = {},
                options = optionArray || {},
                currTitle = null,
                currPanel = null;

            // vars from old tabify()
            var __frag   = document.createDocumentFragment(),
                tabCount = 0;

            function _getUniqueId() {
                var newVal = 'accordion-panel-' + lastId++;
                _registry[newVal] = newVal;
                return newVal;
            }

            function _addPanel(label, content, appendTo) {
                var sID     = '',
                    ndTitle = null,
                    ndPane  = null,
                    ndChild = null;

                appendTo = appendTo || _root;
                sID = _getUniqueId();
                tabCount += 1;
                ndTitle = document.createElement('div');
                ndTitle.className = 'aw-acc-title';
                ndTitle.innerHTML = label;

                appendTo.appendChild(ndTitle);

                ndPane = document.createElement('div');
                ndPane.className = 'aw-acc-pane';
                ndPane.id = sID;
                ndPane.innerHTML = content;
                ndTitle.onclick = function(ndTarget) {
                    return function() {
                        if (_currentPanel != ndTarget) {
                            _currentPanel.classList.remove('active');
                            _currentPanel = ndTarget;
                            _currentTitle.classList.remove('active');
                            _currentTitle = this;
                        }
                        ndTarget.classList.toggle('active');
                        this.classList.toggle('active');
                    }
                }(ndPane);

                appendTo.appendChild(ndPane);
                if (tabCount==1) {
                    _currentTitle = ndTitle;
                    _currentPanel = ndPane;
                    ndTitle.classList.add('active');
                    ndPane.classList.add('active');
                }
            }


            // grab any child elements (not raw text nodes) to form my initial tabs
            var elems = lmnt.children(_root);
            for (i=0; i<nCount; i++) {
                nd = elems[i];

                _addPanel(nd.title ? nd.title : "Panel " + (tabCount+1), nd.innerHTML, __frag);
            }
            _root.innerHTML = '';
            _root.classList.add('aw-accordion');
            _root.appendChild(__frag);


            return {
                root     : _root,
                addPanel : _addPanel
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
