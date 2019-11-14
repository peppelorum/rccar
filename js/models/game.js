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
    self.model.carX = ko.observable(null);
    self.model.carY = ko.observable(null);
    self.model.carDirection = ko.observable('');
    self.model.crash = ko.observable(false);
    self.model.crashSite = ko.observableArray([]);
    self.model.success = ko.observable(false);
    self.model.successChecker = ko.computed(function() {            //This should be a subscribe..
        if (!self.model.crash() && self.model.pathRemaining().length === 0) {
            if (app.models.audio) {
                setTimeout(function() {
                    app.models.game.model.success(true);
                    app.models.audio.startSound('win');
                }, 1000);
            }
        }
        self.model.success(false);
    });

    self.onCrash = ko.computed(function() { 
        if (self.model.crash()) {
            app.models.audio.startSound('loose');
        }
    })


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

    self.willCrash = function(x, y) {
        // debugger
        console.log(x, y, self.model.sizeX(), self.model.sizeY());
        if (x < 0 || y < 0 || x > self.model.sizeX() - 1 || y > self.model.sizeY() - 1) {
            console.error('*********** CRASH ************')
            self.model.crash(true);
            self.model.crashSite([x, y]);
            return true;
        }
        return false;
    }

    self.carMove = function(x, y) {
        if (!self.willCrash(x, y)) {
            self.model.carX(x);
            self.model.carY(y);
        }
    }

    self.carMoveUp = function() {
        var x = self.model.carX() + 1;
        var y = self.model.carY();
        return self.carMove(x, y)
    }

    self.carMoveDown = function() {
        var x = self.model.carX() - 1;
        var y = self.model.carY();
        return self.carMove(x, y)
    }

    self.carMoveRight = function() {
        var x = self.model.carX();
        var y = self.model.carY() +1;
        return self.carMove(x, y)
    }

    self.carMoveLeft = function() {
        var x = self.model.carX();
        var y = self.model.carY() -1;
        return self.carMove(x, y)
    }

    self.driveStep = function(cb) {

        if (self.model.pathRemaining().length === 0) {
            return;
        }

        if (self.model.crash()) {
            return;
        }

        var action = _.first(self.model.pathRemaining());
        var rest = _.rest(self.model.pathRemaining());

        self.model.pathRemaining(rest);
        

        switch (action) {
            case 'F':
                switch (self.model.carDirection()) {
                    case 'N':
                        self.carMoveUp();
                        break;
                    case 'E':  
                        self.carMoveRight();
                        break;
                
                    case 'S':
                        self.carMoveDown();
                        break;
                                
                    default:
                        self.carMoveUp();
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
        }
    }


    self.drive = function() {
        app.models.audio.startSound('ingame');

        self.driveStep(self.driveStep);        
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

    self.updatePathRemaining = ko.computed(function() {
        self.model.pathRemaining(self.model.pathStart());
    });

    self.start = function() {



        self.setCarXYOnStart();
        self.model.carDirection(self.carDirection());

        self.model.pathRemaining(self.model.pathStart());
    }

    self.start();
}