//
// aw-core : helper functions and such
//
// author: Ryan Corradini
// version: 1.0
// date: 22 Apr 2012
// license: MIT
//

"use strict";


// polyfill classList if necessary (seriously, IE9? Seriously?!?)
//   source: http://purl.eligrey.com/github/classList.js/blob/master/classList.js
if(typeof document!=="undefined"&&!("classList" in document.createElement("a"))){(function(j){var a="classList",f="prototype",m=(j.HTMLElement||j.Element)[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.className),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.className=this.toString()}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(o){o+="";if(g(this,o)===-1){this.push(o);this._updateClassName()}};e.remove=function(p){p+="";var o=g(this,p);if(o!==-1){this.splice(o,1);this._updateClassName()}};e.toggle=function(o){o+="";if(g(this,o)===-1){this.add(o)}else{this.remove(o)}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};

// some browsers don't define this constant, which most of the widget bootstraps rely on
window.ELEMENT_NODE = document.ELEMENT_NODE || 1;

// polyfill firstElementChild / nextElementSibling in older browsers
//tr = tr.nextElementSibling || nextElementSibling(tr);
function nextElementSibling( el ) {
    do { el = el.nextSibling } while ( el && el.nodeType !== ELEMENT_NODE );
    return el;
}
function firstElementChild( el ) {
    el = el ? el.firstChild : null;
    if ( el && el.nodeType == ELEMENT_NODE ) {
        return el;
    } else {
        return el.nextElementSibling || nextElementSibling(el);
    }
}
function childElementCount( el ) {
    if ( el && el.children ) { return el.children.length || 0; }
    var count = 0;
    el = el.firstChild;
    do {
        if ( el && el.nodeType == ELEMENT_NODE ) { count++; }
        el = el.nextSibling;
    } while ( el );
    return count;
}
// end of ElementTraversal polyfills


function stopEventCascade(e) {
    if (!e) var e = window.event;
    if (e.preventDefault) {
        e.preventDefault();
    } else if (e.stop) {
        e.stop();
    } else {
        e.cancelBubble = true;
    }

    e.returnValue = false;
    if (e.stopPropagation) e.stopPropagation();
}

/*
  Simon Willison's unobtrusive onLoad event handler
  (http://simonwillison.net/2004/May/26/addLoadEvent/)

  Example usage:
    addLoadEvent(nameOfSomeFunctionToRunOnPageLoad);
    addLoadEvent(function() {
      // more code to run on page load
    });
*/
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}


// ensure AttoWidgets (aw) namespace exists
window.aw = window.aw || {};

window.aw._loadResource = function(type, url, id) {
    var fileRef = null;

    if (type === 'css') {
        fileRef = document.createElement('link');
        fileRef.setAttribute("rel", "stylesheet");
        fileRef.setAttribute("type", "text/css");
        fileRef.setAttribute("href", url);

    } else if (type === 'js') {
        fileRef = document.createElement('script');
        fileRef.setAttribute("type", "text/javascript");
        fileRef.setAttribute("src", url);

    } else {
        // handle error state
    }

    if (fileRef) {
        if (id) { fileRef.setAttribute("id", id); }
        fileRef.onload = function(m) {
            //console.log('loaded:', m);
        };
        document.querySelector('head').appendChild(fileRef);
    }
}

window.aw._loadTemplate = function(url, id) {
    var fileRef = document.createElement('iframe');
    fileRef.setAttribute("style", "display:none");
    fileRef.setAttribute("id", id);
    fileRef.setAttribute("src", url);
    document.querySelector('body').appendChild(fileRef);
}
