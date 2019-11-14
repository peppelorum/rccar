

ko.options.deferUpdates = true;

var app = new function() {

    'use strict';

    var self = this;

    self.dialog = async function() {
        const { value: formValues } = await Swal.fire({
            title: 'Multiple inputs',
            html:
              '<input id="swal-input1" class="swal2-input">' +
              '<input id="swal-input2" class="swal2-input">',
            focusConfirm: false,
            preConfirm: () => {
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
              ]
            }
          })
          
          if (formValues) {
            Swal.fire(JSON.stringify(formValues))
          }
        
    }


    setTimeout(function() {

        ko.applyBindings(app.models);

    }, 1000);
};


