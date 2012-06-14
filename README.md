Atto: Ultralight, Pure-JavaScript UI Components
--------------------------

AttoWidgets are a collection of lightweight JavaScript helper functions and basic UI components that I've built for my own personal use, but figured I'd share in case anyone else wants a *super* light library for something where the overhead of a full-blown library like [Dojo](http://dojotoolkit.com), [YUI](http://developer.yahoo.com/yui/), or [jQuery UI](http://jqueryui.com/) is undesirable. They have on;ly one external dependency: since they're AMD format, so you'll need an AMD-compatible script loader like [RequireJS](http://requirejs.org/) or [curl](https://github.com/cujojs/curl). Beyond that, they're free from any other dependencies, work on all modern web browsers, and [degrade gracefully](http://en.wikipedia.org/wiki/Progressive_enhancement) on IE8 (IE6 and 7 are another matter, sadly, but I'm making the conscious decision not to support those at the moment).

In spirit they're probably more similar to [Wijmo](http://wijmo.com/widgets/) than anything else, but my goal is to make them even smaller and more self-contained than those (awesome though they are). Mostly, though, I just wrote them because I like to tinker. ;)

They're built using as much HTML5 and CSS3 as I could cram in, and lean on CSS3 Transitions to do the heavy lifting of state transformations and animations. As such, the user experience in IE8 is pretty barebones compared to that of more modern browsers. Of course you can replicate these behaviors using jQuery or Mootools or Dojo.FX, but then they wouldn't be quite so ultralight anymore, so I'd rather not.

More information can be found on Atto's official home [here](http://www.buyog.com/atto/).
