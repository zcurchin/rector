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
    let uid = get(this, 'session.currentUser.uid');
    let self = this;

    return new RSVP.Promise((resolve, reject) => {
      user.getCheckIns().then(data => {
        console.log(data.val());

        if (data.val()) {
          console.log(data.val());
          resolve(data.val());

        } else {
          resolve(false);
        }
      });
    });
  },

  setupController(controller, model){
    console.log('# setupController : model :', model);
    let keys = Object.keys(model);
    let checkIns = [];

    if (!model) {
      controller.set('checkedOut', true);      

    } else {
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          let lastCheckIn = model[key];

          if (lastCheckIn.out >= Date.now()) {
            controller.set('checkedIn', false);
            controller.set('checkedOut', model[key].out);
          } else {
            controller.set('checkedIn', model[key].in);
            controller.set('checkedOut', false);
          }
        }
        checkIns.push(model[key]);
      });

      controller.set('model', checkIns);
    }
  }
});
