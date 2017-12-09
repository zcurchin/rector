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
    // let self = this;
    let user = get(this, 'user');
    // let uid = get(this, 'session.currentUser.uid');

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
