define(
  ['atto/core'],
  function(atto) {
    // describe the test suite for Atto Core
    describe(
      "Atto Core: basic helper functions & objects",
      function() {
        // test byId()
        it(
          "should enable shorthand DOM node retrieval",
          function(){
            expect( atto.byId( 'header' ) ).toBe( document.body.children[0] );
            expect( atto.byId( 'noSuchId' ) ).toBeNull();
          }
        );

        // test head
        it(
          "should allow direct access to the document.head object, whether the browser implements it or not.",
          function() {
            expect( atto.head ).toBe( document.getElementsByTagName('head')[0] );
          }
        );

        // test mixinArgs
        it(
          "should correctly mix a source object's attributes into a target attribute",
          function() {
            var o1 = {'this': 5, 'that': '12'},
                o2 = {'this': 17, 'the other': 'something'},
                o3 = {'this': 17, 'that': '12', 'the other': 'something'};
            expect( atto.mixinArgs(o1, o2) ).toEqual( o3 );
          }
        );

        // test supplant
        it(
          "should correctly build a string based on parameter substitution",
          function() {
            var o = {'this': 5, 'that': '12'},
                s = "This: {this}, that: {that}";
            expect( atto.supplant(s,o) ).toEqual( "This: 5, that: 12" );
          }
        );

        // test addLoadEvent
        it(
          "should provide a working abstraction to the window.onload event",
          function() {
            expect( 1 ).toEqual( 2 );
          }
        );

        // test addEvent
        it(
          "should provide a cross-browser way to add DOM events",
          function() {
            expect( 1 ).toEqual( 2 );
          }
        );

        // test addWidgetCss
        it(
          "should provide a way to inject CSS into document.head",
          function() {
            expect( 1 ).toEqual( 2 );
          }
        );

        // test stopEventCascade
        it(
          "should stop an event from propogating up the DOM parent tree",
          function() {
            expect( 1 ).toEqual( 2 );
          }
        );

        // test xhrRequest
        it(
          "should provide a simple cross-browser AJAX request API",
          function() {
            expect( 1 ).toEqual( 2 );
          }
        );
      }
    );
  }
);