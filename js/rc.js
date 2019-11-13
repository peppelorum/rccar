

ko.options.deferUpdates = true;

var app = new function() {

    'use strict';

    var self = this;




    setTimeout(function() {

        ko.applyBindings(app.models);

    }, 1000);
};

