//
// Atto ProgressBar (simple progressbar widget)
//
// author: Ryan Corradini
// date: 21 June 2012
// license: MIT
//

define(
    ["atto/core"], //,"css!atto/awProgressBar.css"],
    function(atto) {
        function constructor(rootNode, optionArgs) {
            var _root = rootNode || document.createElement('div'),
                _bar  = document.createElement('span'),
                opts  = atto.mixinArgs({
                    min: 0,
                    max: 100
                }, optionArgs),
                _min = opts.min,
                _max = opts.max,
                _val = opts.startingValue || _min;

            _setVal(_val);

            _root.innerHTML = "";
            _root.appendChild(_bar);

            // add the appropriate class to the root node
            _root.classList.add('aw-progressbar');

            function _setVal(newVal) {
                var norm = Math.min(_max, Math.max(_min, newVal)) * 100.0,
                    range = (_max - _min),
                    percent = 0;
                if (range > 0) percent = norm / range;
                _val = Math.min(_max, Math.max(_min, newVal));
                _bar.style.width = percent + "%";
            }

            return {
                root     : _root,
                getMin   : function() { return _min; },
                getMax   : function() { return _max; },
                getValue : function() { return _val; },
                setValue : _setVal
            } // end of public interface
        } // end of constructor

        return constructor;
    } // end function
);
