//
// Atto DataView (renders a formatted version of data fetched from an AJAX call)
//
// author: Ryan Corradini
// version: 2.0 (AMD)
// date: 13 Jun 2012
// license: MIT
//

define(
    ["atto/core","require"],
    function(atto) {
        // make sure the appopriate CSS has been loaded for this widget
        var cssTitle = "atto-dataView";
        if (!document.querySelector("style[data-for-widget='"+cssTitle+"']")) {
            require(["text!atto/dataView.css"], function(rawCss) {
                var newCss = document.createElement('style');
                newCss.setAttribute('data-for-widget', cssTitle);
                newCss.type = "text/css";
                newCss.textContent = rawCss;

                document.head.appendChild(newCss);
            });
        }

        function constructor(rootNode, optionArray) {
            var _root  = rootNode || document.createElement('div'),
                opts   = atto.mixinArgs({
                    dataUrl: '',
                    fetchMessage: 'Fetching...'
                }, optionArray);

            // empty out root node's current contents
            _tmpl = _root.innerHTML;
            _root.innerHTML = '';

            // add the appropriate class to the root node
            _root.classList.add('aw-dataView');

            // now define the common operations:
            function _fetch(args) {
               _root.innerHTML = opts.fetchMessage;
               _root.classList.add('pending');

                // will fetch data from the current AJAX dataUrl (if any)
                var fetchUrl, self = this;

                if (opts.dataUrl) {
                    fetchUrl = atto.supplant(opts.dataUrl, args);
                    atto.xhrRequest({
                        url: fetchUrl,
                        success: function(response) {
                            self.update(response);
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
                _root.innerHTML = payload.toString();
            }

            return {
                root     : _root,
                fetch    : _fetch,
                template : _tmpl,
                update   : _renderResult
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
