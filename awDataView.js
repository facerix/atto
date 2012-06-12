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
        opts   = aw.core.mixinArgs({
            dataUrl: '',
            fetchMessage: 'Fetching...'
        }, optionArray);

    // grab the root node's current contents and store them as a template, then clear it
    _tmpl = _root.innerHTML;
    _root.innerHTML = '';

    // add the appropriate class to the root node
    _root.classList.add('aw-dataView');

    // now define the common operations:
    function _fetch(args) {
       _root.innerHTML = opts.fetchMessage;
       _root.classList.add('pending');

        // will fetch data from the current AJAX dataUrl (if any)
        var fetchUrl;

        if (opts.dataUrl) {
            fetchUrl = aw.core.supplant(opts.dataUrl, args);
            aw.core.xhrRequest({
                url: fetchUrl,
                success: function(response) {
                    _renderResult(response);
                    _root.classList.remove('pending');
                },
                failure: function(e) {
                    if (opts.errback && typeof opts.errback === 'function') opts.errback.call(this, {code:e.status,reason:e.statusText});
                    _root.classList.remove('pending');
                }
            });
        } else {
            _root.innerHTML = 'Missing dataUrl parameter; cannot fetch data.';
        }
    }

    function _renderResult(payload) {
        if (opts.templateRenderer) {
            //
        } else if (_tmpl) {
            if (typeof payload === 'string') {
                payload = JSON.parse(payload);
            }
            _root.innerHTML = aw.core.supplant(_tmpl, payload);
        } else {
            _root.innerHTML = payload;
        }
    }

    return {
        get root() { return _root; },
        fetch: _fetch
    };
};
