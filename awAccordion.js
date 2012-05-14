//
// awAccordion.js (AttoWidget Accordion : convert a raw list of DOM nodes into a simple accordion widget)
//
// author: Ryan Corradini
// version: 1.0
// date: 18 Apr 2012
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

aw._loadResource('css', 'awAccordion.css', 'css-slides');


// declare the aw.Accordion widget
aw.Accordion = function(rootNode, optArgs) {
    var _root  = rootNode || document.createElement('div'),
        _currentTitle = null,
        _currentPanel = null,
        i      = 0,
        nd     = null,
        nCount = _root.childNodes.length,
        lastId = 0,
        _registry = {},
        options = optArgs,
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
        ndTitle.className = 'title';
        ndTitle.innerHTML = label;

        appendTo.appendChild(ndTitle);

        ndPane = document.createElement('div');
        ndPane.className = 'pane';
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
    for (i=0; i<nCount; i++) {
        if (_root.childNodes[i].nodeType == ELEMENT_NODE) {
            nd = _root.childNodes[i];

            _addPanel(nd.title ? nd.title : "Panel " + (tabCount+1), nd.innerHTML, __frag);
        }
    }
    _root.innerHTML = '';
    _root.classList.add('accordion');
    _root.appendChild(__frag);


    return {
        "root"        : _root,
        "addPanel"    : _addPanel
    }
}
