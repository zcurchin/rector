import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  user: service(),

  model(){
    let user = get(this, 'user');

    return new RSVP.Promise((resolve, reject) => {
      user.getCheckIns().then(data => {
        if (data.val()) {
          console.log(data.val());
          resolve(data.val());

        } else {
          resolve(false);
        }
      }).catch(error => {
        reject(error);
      });
    });
  },


  setupController(controller, model){
    this._super(controller, model);

    console.log('# setupController : model :', model);

    if (!model) {
      controller.set('checkedIn', false);

    } else {
      let keys = Object.keys(model);
      let history = [];

      keys.forEach((key, index) => {

        if (index === keys.length - 1) {
          let lastCheckIn = model[key];
          console.log('### LAST');

          if (lastCheckIn.out > Date.now()) {
            console.log('### CHECKED IN');
            controller.set('checkedIn', model[key].in);
            controller.set('autoCheckOut', model[key].out);

          } else {
            console.log('### CHECKED OUT');
            controller.set('checkedIn', false);
            controller.set('checkedOut_value', model[key].out);
            history.push(model[key]);
          }

        } else {
          console.log('### NOT LAST');
          history.push(model[key]);
        }
      });

      controller.set('history', history.reverse());
    }
  }
});
