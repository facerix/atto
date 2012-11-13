require.config({
    baseUrl: '../..'
});
require(["atto/core", "atto/ajaxtree"], function(atto, AjaxTree) {
    tree = new AjaxTree(atto.byId("myWidget"), {
        dataUrl: 'dataPump.php?count={num}',
    });

    window.populateTree = function() {
        tree.fetch({num:50});
    }

    setTimeout(populateTree, 5000);
});
