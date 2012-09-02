define(
  ['atto/event'],
  function(AttoEvent) {
    // describe the test suite for Atto Event
    describe(
      "Atto Event",
      function() {
        /*
                name     : _name,
                dispatch : _pub,
                watch    : _sub,
                unwatch  : _unsub
        */
        beforeEach(function() {
            this.event = new AttoEvent('my.event.name');
        });

        describe(
            "name", function() {
                it( "should match the constructor value", function() {
                    expect( this.event.name ).toEqual( 'my.event.name' );
                });
            }
        );

        describe(
            "dispatch", function() {
                beforeEach(function() {
                    this.counter = 0;
                    this.dataOut = null;
                    this.watcher = (function(obj){
                        return function(data) {
                            obj.counter++;
                            obj.dataOut = data;
                        }
                    })(this);
                    this.watcherId = this.event.watch(this.watcher);
                });

                afterEach(function() {
                    this.event.unwatch(this.watcherId);
                });


                it( "should cause a watcher callback to be invoked", function() {
                    runs(function() {
                        this.event.dispatch()
                    });

                    waits( 250 );

                    runs(function() {
                        expect( this.counter ).toEqual( 1 );
                    });
                });

                it( "should invoke each watcher callback in succession", function() {
                    runs(function() {
                        this.watcherId2 = this.event.watch(this.watcher);
                        this.event.dispatch()
                    });

                    waits( 250 );

                    runs(function() {
                        this.event.unwatch( this.watcherId2 );
                        expect( this.counter ).toEqual( 2 );
                    });
                });

                it( "should pass along the provided data object to its watcher callbacks", function() {
                    var dataIn = {'this': 1, 'that': 2};
                    runs(function() {
                        this.event.dispatch( dataIn )
                    });

                    waits( 250 );

                    runs(function() {
                        expect( this.dataOut ).toEqual( dataIn );
                    });
                });
            }
        );

        describe(
            "watch", function() {
                it( "should return a unique ID", function() {
                    expect( this.event.watch( function() {} ) ).toBeTruthy();
                });
            }
        );

        describe(
            "unwatch", function() {
                it( "should return TRUE if given a valid watcher ID", function() {
                    var id = this.event.watch( function() {} );
                    expect( this.event.unwatch( id ) ).toBeTruthy();
                });

                it( "should return FALSE if given an invalid watcher ID", function() {
                    expect( this.event.unwatch( 0 ) ).not.toBeTruthy();
                });
            }
        );

      }
    ); // end of Atto Event spec description
  }
);