

ko.options.deferUpdates = true;

var app = new function() {

    'use strict';

    var self = this;

    // Start dialog
    self.startDialog = function() {
        Swal.fire({
            title: 'Oh no!',
            text: "The evil wizard has kidnapped the dragon and your only chance of saving it is by driving really carefully in a parking lot! But can YOU do it?!",
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Hell yeah!'
          }).then((result) => {
            if (result.value) {
                app.models.audio.startSound('start')
                self.dialog();
            }
          })
    }
    
    // Big dialog with all the choices
    self.dialog = function() {

        Swal.mixin({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            progressSteps: ['1', '2', '3']            
          }).queue([
            {
                title: 'Parking lot size',
                text: 'The evil wizard has temporarily lost his wand and now you got the chance to set the size of the parking lot! Be wise young adventurer!',
                inputPlaceholder: "5 5",
                preConfirm: function(value) {
                    try {
                        var ar = value.split(' ');
                        var a = parseInt(ar[0]);
                        var b = parseInt(ar[1]);

                        if (isNaN(a) || isNaN(b)) {
                            Swal.showValidationMessage('Please enter as 5 5 for example')   
                            throw "Parameter is not a number!";
                        };
                    } catch(e) {
                        console.error('first', e);
                    }
                  }
            },
            {
                title: 'Car position',
                text: 'The evil wizard has temporarily lost his glasses and now you\'ve got the chance to set the position and direction of the car! Choose position and what direction to point at.',
                inputPlaceholder: "1 1 N",
                preConfirm: function(value) {
                    try {
                        var ar = value.split(' ');
                        var a = parseInt(ar[0]);
                        var b = parseInt(ar[1]);
                        var c = '' + ar[2].toUpperCase();

                        if (c !== 'N' && c !== 'E' &&c !== 'S' && c !== 'W') {
                            Swal.showValidationMessage('Please enter as 1 1 N for example')   
                            throw "Parameter is not a number!";
                        }

                        if (isNaN(a) || isNaN(b)) {
                            Swal.showValidationMessage('Please enter as 1 1 N for example')   
                            throw "Parameter is not a number!";
                        };
                    } catch(e) {
                        console.error('first', e);
                        Swal.showValidationMessage('Please enter as 1 1 N for example')   
                    }
                  }
            
            },
            {
                title: 'The route of failure or success?',
                text: 'Darn, the evil wizard has fallen asleep and now you\'ve got the chance to set the route to success! Plan a good way now! (Enter it like FFRFFLFFRBB)',
                preConfirm: function(value) {
                    try {
                        if (value === '' || value.match(/^[FRBLfrbl>]*$/) === null) {
                            Swal.showValidationMessage('Please enter as 5 5 for example')   
                            throw "Parameter is not a number!";
                        };
                    } catch(e) {
                        console.error('first', e);
                    }
                  }
            }
          ]).then((result) => {
            if (result.value) {

                app.models.game.model.size(result.value[0]);
                app.models.game.model.car(result.value[1]);
                app.models.game.model.pathStart(result.value[2]);

                Swal.fire({
                    title: 'All done!',
                    text: 'Now it\'s time to see if you can beat this evil, evil wizard and HOPEFULLY you can win the dragon free!',
                    confirmButtonText: 'LETS ROLL!!!'
                }).then((result) => {
                    app.models.game.setCarXYOnStart()
                    app.models.game.drive();
                })
            }
          });
        
    }

    //Dialog for success
    self.dialogSuccess = function() {
        Swal.fire({
            title: 'HUZZAH!',
            html: 'You made it! <br>'+
            'You saved the dragon and killed the princess! '+
            'All the villagers rejoiced and feasted for three days in your honor!<br>'+
            '(end position: x:'+ app.models.game.model.carX() +' y:'+ app.models.game.model.carY() +' direction:'+ app.models.game.model.carDirection() +')',
            confirmButtonText: '<3'
          })
    }

    //Dialog for crash
    self.dialogCrash = function() {
        Swal.fire({
            title: 'CRASHED!!!!',
            html: 'You crashed the car into the invisible wall surrounding the parking lot and woke the wizard! Now the dragon will be killed!<br>BUT! Please try again!',
            confirmButtonText: 'Yes please',
            showClass: {
                popup: 'animated fadeIn slower'
            },
          }).then((result) => {
              app.models.audio.startSound('start');
              self.startDialog();
              app.models.game.resetCrash();
          })
    }


    setTimeout(function() {

        ko.applyBindings(app.models);
        self.startDialog();

    }, 1000);
};


