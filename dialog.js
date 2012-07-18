//
// Atto Dialog : convert an arbitrary DOM structure into a simple pop-up dialog widget
//
// author: Ryan Corradini
// date: 17 July 2012
// license: MIT
//

define(
    ["atto/core","atto/event","require"],
    function(atto, CustomEvent) {
        // make sure the appopriate CSS has been loaded for this widget
        var forWidget = "atto-dialog";
        if (!document.querySelector("style[data-for-widget='"+forWidget+"']")) {
            require(["text!atto/dialog.css"], function(rawCss) { atto.addWidgetCss(rawCss, forWidget); });
        }

        function constructor(rootNode, optArgs) {
            var _root     = rootNode,
                _underlay = document.createElement('div'),
                _dragging = false;
                opts      = atto.mixinArgs({
                    okButton: '',
                    cancelButton: ''
                }, optArgs);
                _events   = {
                    onCancel: new CustomEvent('atto.dialog.onCancel'),
                    onSubmit: new CustomEvent('atto.dialog.onSubmit'),
                };

            // temporary working vars
            var __frag    = document.createDocumentFragment(),
                __title   = document.createElement('div'),
                __body    = document.createElement('div'),
                __foot    = document.createElement('div'),
                __origHeight = _root.offsetHeight,
                __origWidth  = _root.offsetWidth;

            // helper function; returns the new button for chaining
            function _addButton(parent, label, callback) {
                var btn = document.createElement('button'),
                    appendTo = parent || document.body;
                btn.innerHTML = label;
                if (callback) atto.addEvent(btn, 'click', callback, true);
                appendTo.appendChild(btn);

                return btn;
            }

            // behavior functions
            function _show() {
                _underlay.classList.add('shown');
                _root.classList.add('shown');
            }

            function _cancel() {
                _root.classList.remove('shown');
                _underlay.classList.remove('shown');
                _events.onCancel.dispatch({});
            }

            function _submit() {
                _root.classList.remove('shown');
                _underlay.classList.remove('shown');
                _events.onSubmit.dispatch({});
            }

            function _startDrag() {
                //console.log('starting to drag');
                _dragging = true;
            }

            function _stopDrag() {
                //console.log('done dragging');
                _dragging = false;
            }


            // assemble title bar
            __title.className = 'title';
            __title.appendChild(document.createTextNode(_root.getAttribute('data-atto-title') || "Atto Dialog"));
            atto.addEvent(__title, 'mousedown', function() {
                if (!_dragging) _startDrag();
            }, false);
            atto.addEvent(__title, 'mouseup', function() {
                if (_dragging) _stopDrag();
            });
            atto.addEvent(__title, 'mousemove', function(e) {
                if (_dragging) {
                    //console.log('dragging...', e);
                    var offsetX = e.clientX - 24,
                        offsetY = e.clientY - 16;

                    //console.log('dragging...', offsetX, offsetY);
                    __title.parentNode.style.left = offsetX + 'px';
                    __title.parentNode.style.top  = offsetY + 'px';
                }
            });
            __frag.appendChild(__title);

            // close button (not a child of title, because we don't want the drag/drop events interfering)
            _addButton(__frag, '&times;', function() {
                _cancel();
            }).className = 'aw-close-button';

            // assemble body
            __body.className = 'body';
            // grab the whole body (all DOM nodes) and push it down into the new "body" subelement
            while (_root.lastChild) {
                nd = _root.removeChild(_root.lastChild);
                __body.appendChild(nd);
                if (__body.firstChild) {
                    __body.insertBefore(nd, __body.firstChild);
                } else {
                    __body.appendChild(nd);
                }
            };
            __frag.appendChild(__body);

            // assemble footer
            __foot.className = 'footer';
            _addButton(__foot, 'OK', function() {
                _submit();
            });
            __frag.appendChild(__foot);


            // TODO: add event handler to catch ENTER keyboard event
            atto.addEvent(_root, 'keypress', function(event) {
              var keycode = event.keyCode || event.which;
              if (keycode == 27) {
                // user pressed ESC
                _cancel();
                return true;
              } else {
                // don't eat the keypress
                return false;
              }
            }, false);


            _root.classList.add('aw-dialog');
            _root.style.height = (__origHeight + 64) + 'px';
            _root.style.width = (__origWidth + 16) + 'px';
            _root.appendChild(__frag);
            _underlay.className = 'aw-underlay';
            document.body.appendChild(_underlay);

            return {
                root        : _root,
                events      : _events,
                show        : _show,
                cancel      : _cancel
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
