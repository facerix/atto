//
// aw.DataView (renders a formatted version of data fetched from an AJAX call)
//
// author: Ryan Corradini
// version: 1.1
// date: 25 May 2012
// license: MIT
//

"use strict";

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
        // will fetch data from the current AJAX dataSrc URL (if any)
        var fetchUrl;

        if (opts.dataSrc) {
            fetchUrl = opts.dataSrc + args;     // needs to be more sophisticated; argument substitution would be keen
            aw.core.xhrRequest(fetchUrl, function(e) {
                //console.log('request finished');
                if (e && e.status && e.status === 200) {
                    _root.innerHTML = e.response;       // also needs to be more sopisticated, but this is a proof of concept
                } else {
                    console.error('Apparently I somehow failed to fetch the data. Sorry about that, mate.');
                    if (e.statusText) { console.debug('Failure details:', e.statusText); }
                }
            });
        } else {
        }
    }

    return {
        get root() { return _root; },
        fetch: _fetch
    };
};
