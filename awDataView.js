//
// aw.DataView (renders a formatted version of data fetched from an AJAX call)
//
// author: Ryan Corradini
// version: 1.1
// date: 25 May 2012
// license: MIT
//

"use strict";

aw._loadResource('css', 'awDataView.css', 'css-dataview');

// declare the DataView widget
aw.DataView = function(rootNode, optionArray) {
    var _root  = rootNode || document.createElement('div'),
        _tmpl  = '',
        opts   = optionArray || {};

    // grab the root node's current contents and store them as a template, then clear it
    _tmpl = _root.innerHTML;
    _root.innerHTML = '';

    // add the appropriate class to the root node
    _root.classList.add('aw-dataView');

    // now define the common operations:
    function _fetch(args) {
       _root.innerHTML = 'Fetching...';
       _root.classList.add('pending');

        // will fetch data from the current AJAX dataSrc URL (if any)
        var fetchUrl;

        if (opts.dataSrc) {
            fetchUrl = opts.dataSrc + (args || '');     // needs to be more sophisticated; argument substitution would be keen
            aw.core.xhrRequest(fetchUrl, function(e) {
                //console.log('request finished');
                if (e && e.status && e.status === 200) {
                    _root.innerHTML = e.response || e.responseText;    // also needs to be more sopisticated, but this is a proof of concept
                } else {
                    _root.innerHTML = 'Unable to fetch the requested data.';
                    if (window.console && e.statusText) { console.log('Failure details: ', e.statusText); }
                }
               _root.classList.remove('pending');
            });
        } else {
            _root.innerHTML = 'Missing dataSrc parameter; cannot fetch data.';
        }
    }

    return {
        get root() { return _root; },
        fetch: _fetch
    };
};
