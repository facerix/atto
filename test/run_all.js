require.config({
  baseUrl: '../..'
});
require(
  [
    "atto/test/core-spec",
    "atto/test/event-spec"
  ],
  function(attoSpec) {
      var jasmineEnv = jasmine.getEnv();
      jasmineEnv.updateInterval = 1000;

      var htmlReporter = new jasmine.HtmlReporter();

      jasmineEnv.addReporter(htmlReporter);

      jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
      };

      jasmineEnv.execute();
  }
);
