//
// aw-core : helper functions and such
//
// author: Ryan Corradini
// version: 1.1
// date: 23 May 2012
// license: MIT
//

"use strict";


// polyfill classList if necessary (seriously, IE9? Seriously?!?)
//   source: http://purl.eligrey.com/github/classList.js/blob/master/classList.js
if(typeof document!=="undefined"&&!("classList" in document.createElement("a"))){(function(j){var a="classList",f="prototype",m=(j.HTMLElement||j.Element)[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.className),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.className=this.toString()}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(o){o+="";if(g(this,o)===-1){this.push(o);this._updateClassName()}};e.remove=function(p){p+="";var o=g(this,p);if(o!==-1){this.splice(o,1);this._updateClassName()}};e.toggle=function(o){o+="";if(g(this,o)===-1){this.add(o)}else{this.remove(o)}};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};

// some browsers don't define this constant, which most of the widget bootstraps rely on
window.ELEMENT_NODE = document.ELEMENT_NODE || 1;

// polyfill ElementTraversal interfaces in older browsers
//
// LMNT version 1.1
// author: Ryan Corradini
window.lmnt = function() {
    function _nextElementSibling( el ) {
        if ( el && el.nextElementSibling ) { return el.nextElementSibling; }
        if ( !el ) { return null; }
        do { el = el.nextSibling } while ( el && el.nodeType !== ELEMENT_NODE );
        return el;
    }

    function _previousElementSibling( el ) {
        if ( el && el.previousElementSibling ) { return el.previousElementSibling; }
        if ( !el ) { return null; }
        do { el = el.previousSibling } while ( el && el.nodeType !== ELEMENT_NODE );
        return el;
    }

    function _firstElementChild( el ) {
        if ( el && el.firstElementChild ) { return el.firstElementChild; }
        el = el ? el.firstChild : null;
        if ( el && el.nodeType == ELEMENT_NODE ) {
            return el;
        } else {
            return el.nextElementSibling || _nextElementSibling(el);
        }
    }

    function _lastElementChild( el ) {
        if ( el && el.lastElementChild ) { return el.lastElementChild; }
        el = el ? el.lastChild : null;
        if ( el && el.nodeType == ELEMENT_NODE ) {
            return el;
        } else {
            return el.previousElementSibling || _previousElementSibling(el);
        }
    }

    function _childElementCount( el ) {
        // note that we can't use el.children because IE<9 lies, including comment nodes.
        if ( el && el.childElementCount ) { return el.childElementCount; }
        var count = 0;
        el = el ? el.firstChild : null;
        do {
            if ( el && el.nodeType == ELEMENT_NODE ) { count++; }
            el = el.nextSibling;
        } while ( el );
        return count;
    }

    function _childElements( el ) {
        // see above; can't trust el.children, so we have to do it manually no matter what.
        var stash = [];
        el = el ? el.firstChild : null;
        while ( el ) {
            if ( el && el.nodeType == ELEMENT_NODE ) { stash.push( el ); }
            el = el.nextSibling;
        };
        return stash;
    }

    return {
        nextElementSibling     : _nextElementSibling,
        previousElementSibling : _previousElementSibling,
        firstElementChild      : _firstElementChild,
        lastElementChild       : _lastElementChild,
        childElementCount      : _childElementCount,
        children               : _childElements
    }
}();
// end of ElementTraversal polyfills


// ensure AttoWidgets (aw) namespace exists
window.aw = window.aw || function() {

    function _lastScriptPath() {
        var path = null,
            script_sources = document.querySelectorAll('script[src]');
        if (script_sources) {
            path = script_sources[script_sources.length-1].src;
        }

        return path ? path.substr(0,path.lastIndexOf('/')+1) : null;
    }

    function _loadResource(type, url, id) {
        var fileRef = null;

        // if url doesn't include an explicit path, assume the most recently loaded script file's path
        //  (which for Attowidgets that load their own stylesheets is a pretty safe assumption!)
        if (url.indexOf('/') == -1) {
            url = _lastScriptPath() + url;
        }

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

    function _loadTemplate(url, id) {
        var fileRef = document.createElement('iframe');
        fileRef.setAttribute("style", "display:none");
        fileRef.setAttribute("id", id);
        fileRef.setAttribute("src", url);
        document.querySelector('body').appendChild(fileRef);
    }

    return {
        _lastScriptPath: _lastScriptPath,
        _loadResource  : _loadResource,
        _loadTemplate  : _loadTemplate
    };

}();

aw.core = aw.core || {
    stopEventCascade: function(e) {
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
    },

    addLoadEvent: function(func) {
    /*
      Simon Willison's unobtrusive onLoad event handler
      (http://simonwillison.net/2004/May/26/addLoadEvent/)

      Example usage:
        addLoadEvent(nameOfSomeFunctionToRunOnPageLoad);
        addLoadEvent(function() {
          // more code to run on page load
        });
    */
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
    },

    byId: function(id) {
    // convenience shortcut; no real improvement other than code shorthand
        return document.getElementById(id);
    }
};
