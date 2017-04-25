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
    let self = this;
    let user = get(this, 'user');
    let uid = get(this, 'session.currentUser.uid');

    return new RSVP.Promise(resolve => {
      let requests = {
        profile: user.get('profile'),
        grades: self.get('firebaseUtil').findAll('publicGrades/' + uid)
      };

      RSVP.hash(requests).then(data => {
        console.log(data);
        resolve(data);
      });
    });
  },

  actions: {
    editProfile(){
      this.transitionTo('account');
    }
  }
});
