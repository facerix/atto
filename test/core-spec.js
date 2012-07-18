define(
  ['atto/core'],
  function(atto) {
    // describe the test suite for Atto Core
    describe(
      "Atto Core",
      function() {
        // test byId()
        describe(
            "byId()", function() {
                it(
                    "should find existing DOM nodes by id",
                    function(){
                        expect( atto.byId( 'header' ) ).toBe( document.body.children[0] );
                    }
                );

                it(
                    "should return null for nonexisting DOM nodes",
                    function(){
                        expect( atto.byId( 'noSuchId' ) ).toBeNull();
                    }
                );
            }
        );

        // test head
        describe(
            "head", function() {
                it(
                    "should allow direct access to the document.head object, whether the browser implements it or not.",
                    function() {
                        expect( atto.head ).toBe( document.getElementsByTagName('head')[0] );
                    }
                );
            }
        );

        // test mixinArgs
        describe(
            "mixinArgs()", function() {
                it(
                    "should correctly mix a source object's attributes into a target object",
                    function() {
                        var o1 = {'this': 5, 'that': '12'},
                            o2 = {'this': 17, 'the other': 'something'},
                            o3 = {'this': 17, 'that': '12', 'the other': 'something'};
                        expect( atto.mixinArgs(o1, o2) ).toEqual( o3 );
                    }
                );
            }
        );

        // test supplant
        describe(
            "supplant()", function() {
                it(
                    "should correctly build a string based on parameter substitution",
                    function() {
                        var o = {'this': 5, 'that': '12'},
                            s = "This: {this}, that: {that}";
                        expect( atto.supplant(s,o) ).toEqual( "This: 5, that: 12" );
                    }
                );
            }
        );

/*
        // test addLoadEvent
        describe(
            "addLoadEvent()", function() {
                it(
                    "should provide a working abstraction to the window.onload event",
                    function() {
                        var p = null;
                        atto.addLoadEvent(function() {
                            p = document.createElement('p');
                            p.id = 'insertedNode';
                            document.body.appendChild(p);
                        });

                        waitsFor(function() {
                            p = atto.byId('insertedNode');
                            return (p != null);
                        }, "onload should have fired", 5000);

                        runs(function() {
                            expect( p ).not.toBeNull( );
                        });
                    }

                );
            }
        );

        // test addEvent
        describe(
            "addEvent()", function() {
                it(
                    "should provide a cross-browser way to add DOM events",
                    function() {
                        expect( 1 ).toEqual( 2 );
                    }
                );
            }
        );

        // test stopEventCascade
        describe(
            "stopEventCascade()", function() {
                it(
                    "should stop an event from propogating up the DOM parent tree",
                    function() {
                        expect( 1 ).toEqual( 2 );
                    }
                );
            }
        );
*/

        // test addWidgetCss
        describe(
            "addWidgetCss()", function() {
                it(
                    "should provide a way to inject CSS into document.head",
                    function() {
                        var selector = "style[data-for-widget=some-widget]";
                        runs(function() {
                            atto.addWidgetCss(".someWidget { display: none; }", "some-widget");
                        });

                        waitsFor(function() {
                            return (document.querySelector(selector) != null)
                        }, 500);

                        runs(function() {
                            expect( document.querySelector(selector) ).not.toBeNull();
                        });
                    }
                );
            }
        );

/*
        // test xhrRequest
        describe(
            "xhrRequest()", function() {
                it(
                    "should provide a simple cross-browser AJAX request API",
                    function() {
                        runs(function() {
                        });

                        waitsFor(function() {
                        }, "the XHR should have returned", 750);

                        runs(function() {
                            expect( 1 ).toEqual( 2 );
                        });
                    }
                );
            }
        );
*/

        // test getKeys
        describe(
            "getKeys()", function() {
                it(
                    "should get all keys from an object literal",
                    function() {
                        var o = {'a': 1, 'b': 2, 'c': 3},
                            l = ['a', 'b', 'c'];
                        expect( atto.getKeys(o) ).toEqual( l );
                    }
                );

                it(
                    "should return an empty list from an empty object",
                    function() {
                        var o = {},
                            l = [];
                        expect( atto.getKeys(o) ).toEqual( l );
                    }
                );
            }
        );

      }

    ); // end of Atto Core suite description

  } // end of require callback
);