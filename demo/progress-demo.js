require.config({
    baseUrl: '../..'
});
require(["atto/core","atto/progressBar"], function(atto, ProgressBar) {
    var prog  = new ProgressBar(atto.byId("prg"), {min:0,max:50}),
        span  = atto.byId('val');
        incr  = 1,
        timer = null;
    window.pb = prog;

    atto.addEvent(atto.byId('btnOnOff'), 'click', function(e) {
        if (timer) {
            // stop animating
            this.innerText = "Resume";
            clearInterval(timer);
            timer = null;
        } else {
            this.innerText = "Stop";
            timer = setInterval(anim, 100);
        }
    });

    anim = function() {
        var v = prog.getValue();
        if (v >= prog.getMax()) {
            incr = -2;
        } else if (v <= prog.getMin()) {
            incr = 2;
        }
        prog.setValue(v + incr);
        span.innerHTML = (v + incr);
    };
});
