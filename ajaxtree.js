//
// Atto AjaxTree (example of how to approach widget subclassing)
//
// author: Ryan Corradini
// date: 7 Nov 2012
// license: MIT
//

define(
    ["atto/core", "atto/tree", "require"],
    function(atto, Tree) {
        // make sure the appopriate CSS has been loaded for this widget
        var forWidget = "atto-tree";
        if (!document.querySelector("style[data-for-widget='"+forWidget+"']")) {
            require(["text!atto/ajaxtree.css"], function(rawCss) { atto.addWidgetCss(rawCss, forWidget); });
        }

        function constructor(rootNode, optionArray) {
            var _root  = rootNode || document.createElement('div'),
                opts   = atto.mixinArgs({
                    dataUrl: '',
                }, optionArray),
                _parentTree = new Tree(_root, opts);

            function _processResults(people) {
                var i,j,
                    surname, surnames, people_by_surname = {},
                    surname_node, people_objects;

                people_objects = (typeof people == 'string') ? JSON.parse(people) : people;
                _root.innerHTML = '';
                for (i=0; i<people_objects.length; i++) {
                    surname = people_objects[i].surname;
                    if (surname in people_by_surname) {
                        people_by_surname[surname].push(people_objects[i]);
                    } else {
                        people_by_surname[surname] = [people_objects[i]];
                    }
                }

                surnames = atto.getKeys(people_by_surname);
                surnames.sort();
                for (i=0; i<surnames.length; i++) {
                    surname_node = _parentTree.addNode({
                        label: surnames[i]
                    });
                    people_objects = people_by_surname[surnames[i]];
                    for (j=0; j<people_objects.length; j++) {
                        _parentTree.addNode({
                            label: atto.supplant("{first_name} ({birthDate})", people_objects[j])
                        }, surname_node);
                    }
                }
                _root.classList.remove('pending');
                if (_root.children.length > 0) _root.classList.remove('empty');
            }

            // now define the common operations:
            function _fetch(args) {
               _root.classList.add('pending');

                // will fetch data from the current AJAX dataUrl (if any)
                var fetchUrl, self = this;

                if (opts.dataUrl) {
                    fetchUrl = atto.supplant(opts.dataUrl, args);
                    atto.xhrRequest({
                        url: fetchUrl,
                        success: _processResults,
                        failure: function(e) {
                            if (opts.errback && typeof opts.errback === 'function') opts.errback.call(this, {code:e.status,reason:e.statusText});
                            _root.classList.remove('pending');
                        }
                    });
                } else {
                    _root.innerHTML = 'Missing dataUrl parameter; cannot fetch data.';
                }
            }

            _root.classList.add('aw-ajaxtree');
            _root.classList.add('empty');

            return {
                root  : _root,
                fetch : _fetch
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
