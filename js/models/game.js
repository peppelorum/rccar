'use strict';

if (!app.models) {
    app.models = {};
}

app.models.game = new function() {
    'use strict';

    var self = this;
    self.model = {};

    //Model properties of the game
    self.model.size = ko.observable('5 5');
    self.model.car = ko.observable('1 1 N');
    self.model.pathStart = ko.observable('FFFRFFLBB');
    self.model.pathRemaining = ko.observable('');
    self.model.carX = ko.observable(null);
    self.model.carY = ko.observable(null);
    self.model.carDirection = ko.observable('');
    self.model.crash = ko.observable(false);
    self.model.crashSite = ko.observableArray([]);
    self.model.space = ko.observableArray([]);
    self.model.success = ko.observable(false);
    self.model.successChecker = ko.computed(function() {            //This should be a subscribe..
        if (!self.model.crash() && self.model.pathRemaining().length === 0) {
            if (app.models.audio) {
                setTimeout(function() {
                    app.models.game.model.success(true);
                    app.models.audio.startSound('win');
                    app.dialogSuccess();
                }, 1000);
            }
        }
        self.model.success(false);
    });

    //Event handler for crash
    self.onCrash = ko.computed(function() { 
        if (self.model.crash()) {
            app.models.audio.startSound('loose');
            setTimeout(function() {
                app.dialogCrash();
            }, 2000)
            
        }
    })

    //Reset after a crash
    self.resetCrash = function() {
        self.model.crash(false);
        self.model.pathStart('FFFRFFLBB');
        self.model.pathRemaining('FFFRFFLBB');
    }

    //Listen to the form input 
    self.carDirection = ko.computed(function() {
        try {
            var direction = self.model.car().split(' ')[2];
            self.model.carDirection(direction);
            return direction;
        } catch(e) {
            console.error('direction', e)
        }
        
    });
    
    //Update the map size
    self.model.sizeX = ko.computed(function() {
        try {
            var x = parseInt(self.model.size().split(' ')[0], 10);
            return x;
        } catch(e) {
            console.error('X', e);
            return 0;
        }
    });

    //Update the map size
    self.model.sizeY = ko.computed(function() {
        try {
            var x = parseInt(self.model.size().split(' ')[1], 10);
            return x;
        } catch(e) {
            console.error('Y', e);
            return 0;
        }
    });

    //Update the car position
    self.model.guiCarX = ko.computed(function() {
        var x = ((self.model.sizeX() - self.model.carX() -1) / self.model.sizeX()) * 100;
        return x +'%';
    })

    //Update the car position
    self.model.guiCarY = ko.computed(function() {
        var y = (self.model.carY() / self.model.sizeY()) * 100;
        return y +'%';
    })

    //Update the map/space on update of input
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

    //Clear the map/space on update of input
    self.clearSpace = function() {
        for (let i = 0; i < self.model.space().length; i++) {
            var item = self.model.space()[i];

            for (let j = 0; j < item().length; j++) {
                var item2 = item()[j];
                item2(0);   
            }  
        }
    }

    //Check if the car will crash on next move
    self.willCrash = function(x, y) {
        if (x < 0 || y < 0 || x > self.model.sizeX() - 1 || y > self.model.sizeY() - 1) {
            console.error('*********** CRASH ************')
            self.model.crash(true);
            self.model.crashSite([x, y]);
            return true;
        }
        return false;
    }

    //Helper functions for moving of the car
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

    //Drive step by step, takes a callback as argument
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
                        self.carMoveLeft();
                        break;
                }
                break;
            case 'B':
                switch (self.model.carDirection()) {
                    case 'N':
                        // var prev = self.model.carX();
                        // self.model.carX(prev - 1);
                        self.carMoveDown();
                        break;
                    case 'E':
                        self.carMoveLeft();
                        break;
                    case 'S':
                        self.carMoveUp();
                        break;
                                
                    default:
                        self.carMoveRight();
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

    //Start drive!
    self.drive = function() {
        app.models.audio.startSound('ingame');

        self.driveStep(self.driveStep);        
    };

    //Set the car on the map
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

    //Set the remainder of the path
    self.updatePathRemaining = ko.computed(function() {
        self.model.pathRemaining(self.model.pathStart());
    });

    //Start method
    self.start = function() {
        self.setCarXYOnStart();
        self.model.carDirection(self.carDirection());

        self.model.pathRemaining(self.model.pathStart());
    }

    self.start();
}