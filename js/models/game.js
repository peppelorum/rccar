'use strict';

if (!app.models) {
    app.models = {};
}


app.models.game = new function() {
    'use strict';

    var self = this;
    self.model = {};

    self.start = function() {
        console.log('asd')
    };

    self.model.size = ko.observable('5 5');
    self.model.car = ko.observable('1 1 N');
    self.model.pathStart = ko.observable('FFFRFFLBB');
    self.model.pathRemaining = ko.observable('');
    self.model.carX = ko.observable(-1);
    self.model.carY = ko.observable(-1);
    self.model.carDirection = ko.observable('');
    self.model.success = ko.observable(true);
    self.model.crashSite = ko.observable('');


    self.carDirection = ko.computed(function() {
        try {
            var direction = self.model.car().split(' ')[2];
            return direction;
        } catch(e) {
            console.error('direction', e)
        }
        
    });


    
    self.model.sizeX = ko.computed(function() {
        try {
            var x = parseInt(self.model.size().split(' ')[0], 10);
            return x;
        } catch(e) {
            console.error('X', e);
            return 0;
        }
    });
    self.model.sizeY = ko.computed(function() {
        try {
            var x = parseInt(self.model.size().split(' ')[1], 10);
            return x;
        } catch(e) {
            console.error('Y', e);
            return 0;
        }
    });

    self.model.guiCarX = ko.computed(function() {
        var x = ((self.model.sizeX() - self.model.carX() -1) / self.model.sizeX()) * 100;
        return x +'%';
    })

    self.model.guiCarY = ko.computed(function() {
        var y = (self.model.carY() / self.model.sizeY()) * 100;
        return y +'%';
    })


    self.model.space = ko.observableArray([]);


    self.model.spacer = ko.computed(function() {
        var ar = [];
        for (let i = 0; i < self.model.sizeX(); i++) {
            var item = ko.observableArray([]);
            for (let j = 0; j < self.model.sizeY(); j++) {
                item.push(ko.observable(0))
            }
            ar.push(item);
        }

        self.model.space(ar);
    });

    self.clearSpace = function() {
        for (let i = 0; i < self.model.space().length; i++) {
            var item = self.model.space()[i];

            for (let j = 0; j < item().length; j++) {
                var item2 = item()[j];
                item2(0);   
            }  
        }
    }

    self.carMove = function() {
        
    }

    self.setCarAtPos = function(x, y) {

        if (x < 0 || y < 0 || x > self.model.sizeX() || y > self.model.sizeY()) {
            console.error('*********** CRASH ************')
            return;
        }

        if (isNaN(x) || isNaN(y)) {
            return;
        }
        // debugger
        self.clearSpace();
        try {
            self.model.space()[x]()[y](1);
        } catch(e) {
            console.log('x', x, y)
            console.error('setcaratpos', e, x)
        }
        
    }

    self.updateCarToPosInput = ko.computed(function() {
        // debugger
        var x = self.model.sizeX() - (self.model.carX() + 1);     //Flip the Y axis
        var y = self.model.carY();
        self.setCarAtPos(x, y);
    });

    self.driveStep = function(cb) {

        if (self.model.pathRemaining().length === 0) {
            return;
        }

        var action = _.first(self.model.pathRemaining());
        var rest = _.rest(self.model.pathRemaining());

        self.model.pathRemaining(rest);


        switch (action) {
            case 'F':
                switch (self.model.carDirection()) {
                    case 'N':
                        var prev = self.model.carX();
                        self.model.carX(prev + 1);
                        break;
                    case 'E':  
                        var prev = self.model.carY();
                        self.model.carY(prev + 1);
                        break;
                
                    case 'S':
                        var prev = self.model.carX();
                        self.model.carX(prev - 1);
                        break;
                                
                    default:
                        var prev = self.model.carY();
                        self.model.carY(prev - 1);
                        break;
                }
                break;
            case 'B':
                    switch (self.model.carDirection()) {
                        case 'N':
                            var prev = self.model.carX();
                            self.model.carX(prev - 1);
                            break;
                        case 'E':
                            var prev = self.model.carY();
                            self.model.carY(prev - 1);
                            break;
                        case 'S':
                            var prev = self.model.carX();
                            self.model.carX(prev + 1);
                            break;
                                    
                        default:
                            var prev = self.model.carY();
                            self.model.carX(prev + 1);
                            break;
                    }
                    break;
            case 'R':
                switch (self.model.carDirection()) {
                    case 'N':
                        self.model.carDirection('E')
                        break;
                    case 'E':
                            self.model.carDirection('S')
                            break;
                    case 'S':
                            self.model.carDirection('W')
                            break;
                    default:
                        self.model.carDirection('N')
                        break;
                }
                break;
            case 'L':
                    switch (self.model.carDirection()) {
                        case 'N':
                            self.model.carDirection('W')
                            break;
                        case 'W':
                                self.model.carDirection('S')
                                break;
                        case 'S':
                                self.model.carDirection('E')
                                break;
                        default:
                            self.model.carDirection('N')
                            break;
                    }
                    break;
            default:
                break;
        }

        if (cb) {
            setTimeout(cb, 1000, cb);
            // cb();
        }
    }


    self.drive = function() {


        self.driveStep(self.driveStep);
        // while (true) {
        //     if (self.model.pathRemaining().length === 0) {
                
        //         break;
        //     }
            
        //     self.driveStep();
        // }
        
    };



    self.setCarXYOnStart = function() {

            try {
                var x = parseInt(self.model.car().split(' ')[0], 10) - 1;
                self.model.carX(x);
            } catch(e) {
                console.error('carX', e);
                return 0;
            }

            try {
                var y = parseInt(self.model.car().split(' ')[1], 10) - 1;
                self.model.carY(y);
            } catch(e) {
                console.error('carY', e);
                return 0;
            }
    }

    self.carUpdate = ko.computed(function() {
        self.setCarXYOnStart();
    });

    self.updatePathRemaining = ko.computed(function() {
        self.model.pathRemaining(self.model.pathStart());
    });

    self.start = function() {

        self.setCarXYOnStart();
        self.model.carDirection(self.carDirection());

        self.model.pathRemaining(self.model.pathStart());

        var x = self.model.sizeX() - (self.model.carX() + 1);     //Flip the Y axis
        self.setCarAtPos(x, self.model.carY());
    }

    self.start();
}