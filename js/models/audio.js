'use strict';

if (!app.models) {
    app.models = {};
}


app.models.audio = new function() {
    'use strict';

    var self = this;
    self.model = {};

    self.model.start = new Audio('../../audio/start.mp3');
    self.model.ingame = new Audio('../../audio/ingame.mp3');
    self.model.win = new Audio('../../audio/win.mp3');
    self.model.loose  = new Audio('../../audio/loose.mp3');

    self.model.start.loop = true
    self.model.ingame.loop = true

    self.startSound = function(sound) {

        self.model.start.pause();
        self.model.ingame.pause();
        self.model.win.pause();
        self.model.loose.pause();

        try {
            self.model[sound].play();
        } catch(e) {
            console.error('playsound', e);
        }
        
    }

}