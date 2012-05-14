//
// aw.SlideBox (converts a raw list of DOM nodes into a simple slideshow widget)
//
// author: Ryan Corradini
// version: 1.0
// date: 2 Mar 2012
// license: MIT
//

"use strict";

/* polyfill classList if necessary (seriously, IE9? Seriously?!?) */
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
//if(typeof document!=="undefined"&&!("classList" in document.createElement("a"))){(function(j){var a="classList",f="prototype",m=(j.HTMLElement||j.Element)[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.className),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.className=this.toString()}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(o){o+="";if(g(this,o)===-1){this.push(o);this._updateClassName()}};e.remove=function(p){p+="";var o=g(this,p);if(o!==-1){this.splice(o,1);this._updateClassName()}};e.toggle=function(o){o+="";if(g(this,o)===-1){this.add(o)}else{this.remove(o)}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};
//
//window.ELEMENT_NODE = document.ELEMENT_NODE || 1;
//
//// ensure AttoWidgets (aw) namespace exists
//window.aw = window.aw || {};

aw._loadResource('css', 'awSlideBox.css', 'css-slides');


// declare the awSlideBox widget
aw.SlideBox = function(rootNode, optionArray) {
    var _root   = rootNode || document.createElement('div'),
        _slides = [],
        _curr   = 0,
        i       = 0,
        nd      = 0,
        nCount  = _root.childNodes.length;

    // grab any child elements (not raw text nodes) to form the initial slides for our deck
    for (i=0; i<nCount; i++) {
        if (_root.childNodes[i].nodeType == ELEMENT_NODE) {
            nd = _root.childNodes[i];
            nd.setAttribute('data-baseClasses', nd.className + ' slide ');
            nd.className = nd.className + ' slide next';
            _slides.push(nd);
        }
    }

    // add the appropriate class to the root node
    _root.classList.add('slidebox');

    // prev link
    nd = document.createElement('a');
    nd.className = 'prev-button';
    nd.innerHTML = '&#x2039;';
    nd.onclick = function(tgt) {
        return function(e) {
            stopEventCascade(e);
            slides_prev();
            return false;
        }
    }(this);
    _root.appendChild(nd);

    // next link
    nd = document.createElement('a');
    nd.className = 'next-button';
    nd.innerHTML = '&#x203A;';
    nd.onclick = function(tgt) {
        return function(e) {
            stopEventCascade(e);
            slides_next();
            return false;
        }
    }(this);
    _root.appendChild(nd);


    // make slide #0 visible
    _setSlideState(0, 'current');


    // helper function to make the class munging less messy
    //  (classList can't help because it doesn't have a 'replace' method,
    //  and we need to add & remove at the same time to make the transition look right)
    function _setSlideState(index, state) {
        var nd = _slides[index],
            baseClasses = '';
        if (nd) {
            baseClasses = nd.getAttribute('data-baseClasses');
            nd.className = baseClasses + state;
        }
    }

    // now define the common operations:
    function slides_goto(index) {
        var i = 0;
        if ((index != _curr) &&
            (index >= 0) &&
            (index < _slides.length)) {

            if (index < _curr) {
                for (i=index+1; i<=_curr; i++) {
                    _setSlideState(i, 'next');
                }
                //_setSlideState(_curr, 'next');
            } else {
                for (i=_curr; i<index; i++) {
                    _setSlideState(i, 'prev');
                }
                //_setSlideState(_curr, 'prev');
            }

            _curr = index;
            _setSlideState(index, 'current');
        }
    }

    function slides_next() {
        if (_curr < _slides.length-1) {
            _setSlideState(_curr, 'prev');

            _curr++;
            _setSlideState(_curr, 'current');
        }
    }

    function slides_prev() {
        if (_curr > 0) {
            _setSlideState(_curr, 'next');

            _curr--;
            _setSlideState(_curr, 'current');
        }
    }

    return {
        "root":   _root,
        "slides": _slides,
        "currentSlide": _curr,
        "goto":   slides_goto,
        "next":   slides_next,
        "prev":   slides_prev
    };
};
