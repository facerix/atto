//
// Atto DataView (renders a formatted version of data fetched from an AJAX call)
//
// author: Ryan Corradini
// version: 2.0 (AMD)
// date: 13 Jun 2012
// license: MIT
//

define(
    ["atto/core"], //,"text!awDataView.css"],
    function(atto) {
        function constructor(rootNode, optionArray) {
            var _root  = rootNode || document.createElement('div'),
                _tmpl  = '',
                opts   = atto.mixinArgs({
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
                    fetchUrl = atto.supplant(opts.dataUrl, args);
                    atto.xhrRequest({
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
                    _root.innerHTML = atto.supplant(_tmpl, payload);
                } else {
                    _root.innerHTML = payload;
                }
            }

            return {
                root : _root,
                fetch: _fetch
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
