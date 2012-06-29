require.config({
    baseUrl: '../..'
});
require(
    ["atto/core","atto/dataView", "atto/mixin_templatize", "/js/mustache/mustache.js"],
    function(atto, DataView, templatize) {
        var dview = new DataView(atto.byId("dataBound"), {
            dataUrl: 'dataPump.php?count={num}',
            fetchMessage: 'Please wait...',
            errback: function(args) {
                atto.byId('dataBound').innerHTML = 'Unable to fetch the requested data; Error details: ' + args.reason;
            }
        });

        // now inject the custom templating behavior
        templatize(dview);
        dview.updateCallback = function(tmpl, data) {
            this.root.innerHTML = Mustache.render(tmpl, {people:data});
        }

        var links = document.querySelectorAll('li a[data-target]');
        for (var idx in links) {
            links[idx].onclick = function() {
                dview.fetch({num:this.getAttribute('data-target')});
                atto.stopEventCascade();
                return false;
            }
        }
    }
);
