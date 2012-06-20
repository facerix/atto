//
// Atto Mixin : Templatize (functionality mixin to enable custom templating for content widgets)
//
// author: Ryan Corradini
// version: 1.0
// date: 19 Jun 2012
// license: MIT
//

define(
    ["atto/core"],
    function(atto) {
        function templatize(obj) {
            function _update(data) {
                var oData = (typeof data === "string" ? JSON.parse(data) : data);
                if (this.updateCallback && typeof this.updateCallback === "function") {
                    this.updateCallback.call(this, this.template, oData);
                } else if (this.template && this.root) {
                    this.root.innerHTML = atto.supplant(this.template, oData);
                } else if (this.root) {
                    this.root.innerHTML = JSON.stringify(oData);
                } else {
                    this.content = JSON.stringify(oData);
                }
            } // end of _update

            if (obj) {
                // template should've been snagged already (at least dataView does); if not, try to get it now
                if (!obj.template) {
                    if (obj.root && obj.root.innerHTML) {
                        obj.template = obj.root.innerHTML;
                        obj.root.innerHTML = "";
                    } else {
                        obj.template = "";
                    }
                }

                // add an update() method, archiving any pre-existing one
                if (obj.update) {
                    obj._oldUpdate = obj.update;
                }
                obj.update = _update;

            } else {
                throw "No object provided to templatize";
            }

            return obj;
        } // end of templatize()

        return templatize;
    } // end of define() callback
);
