//
// Atto.tao: lightweight HTML templating using Zen Coding syntax
//   (see http://code.google.com/p/zen-coding/)
//
// author: Ryan Corradini
// version: 1.0
// date: 29 Oct 2012
// license: MIT
//

/*
Example, from the Zen Coding homepage:

var dom_fragment = tao.expand("div#page>div.logo+ul#navigation>li*5>a");

dom_fragment.toString():

    <div id="page">
            <div class="logo"></div>
            <ul id="navigation">
                    <li><a href=""></a></li>
                    <li><a href=""></a></li>
                    <li><a href=""></a></li>
                    <li><a href=""></a></li>
                    <li><a href=""></a></li>
            </ul>
    </div>

*/

define(
    function() {
        "use strict";

        var _tagRex   = /^[a-z]+[1-6]?/i,
            _posRex   = /[>|<|\+]+/g,
            _idRex    = /#[_a-z]+[_a-z0-9-]*/i,
            _classRex = /\.-?[_a-z]+[_a-z0-9-]*/i,                ///\.[a-z]+/i,
            _textRex  = /{[^}]+}/,
            _countRex = /\*[0-9]+/;

        function _buildElement(spec) {
            var tag = _tagRex.exec(spec),
                i, matches = null,
                el = tag ? document.createElement(tag[0]) : null;
            if (el) {
                if (_idRex.test(spec)) {
                    matches = _idRex.exec(spec);
                    el.id = matches[0].slice(1);
                }
                if (_classRex.test(spec)) {
                    matches = _classRex.exec(spec);
                    for (i=0; i< matches.length; i++) {
                        el.classList.add(matches[i].slice(1));
                    }
                }
                if (_textRex.test(spec)) {
                    matches = _textRex.exec(spec);
                    el.appendChild(document.createTextNode( matches[0].slice(1, -1) ));
                }

                if (_countRex.test(spec)) {
                    // TODO: return a list instead of a single node
                }
            } else {
                // no tag; maybe it's a bare text node?
                if (_textRex.test(spec)) {
                    matches = _textRex.exec(spec);
                    el = document.createTextNode( matches[0].slice(1, -1) );
                }
            }
            return el;
        }


    // here are the to-be-exposed functions

        function _parseTree(expression, serialize) {
            var _frag = (serialize) ? document.createElement('div') : document.createDocumentFragment(),
                _cur = _frag,
                child = null,
                i, posCode, tags = expression.split(_posRex);
            for (i=0; i<tags.length; i++) {
                child = _buildElement(tags[i]);
                if (child) {
                    _cur.appendChild(child);
                    posCode = _posRex.exec(expression);

                    if (posCode && posCode.length) {
                        switch (posCode[0]) {
                            case '<':
                                // jump back up to the previous insertion level
                                _cur = _cur.parentNode;
                                break;
                            case '>':
                                // insert next element into this new child
                                _cur = child;
                                break;
                            case '+':
                                // no change in insert level
                                break;
                            default:
                                // unrecognized insert level operation
                                console.log('next posCode:', posCode);
                        }
                    }
                }
            }

            return (serialize) ? _frag.innerHTML : _frag;
        }

        function _createElement(expression) {
            var tags = expression.split(_posRex);
            return _buildElement(tags[0]);
        }


        // return available generator functions
        return {
            expand : _parseTree,
            create : _createElement
        };
    }
);