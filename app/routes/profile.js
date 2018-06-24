import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  user: service(),
  store: service(),

  model(){
    // let self = this;
    let user = get(this, 'user');
    let store = get(this, 'store');

    return new RSVP.Promise((resolve, reject) => {
      let requests = {
        profile: user.get('profile'),
        grades: user.get('publicGrades')
      };

      RSVP.hash(requests).then(data => {
        //console.log(data);
        resolve(data);

      }).catch(error => {
        reject(error);
      });
    });
  },


  deactivate(){
    this.controller.set('editingProfile', false);
    this.controller.set('preloader', false);
    this.controller.set('error_msg', '');
  }
});
