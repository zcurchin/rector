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

    return new RSVP.Promise(resolve => {
      let requests = {
        profile: user.get('profile'),
        account: user.get('account'),
        grades: self.get('firebaseUtil').findAll('publicGrades/' + uid)
      };

      RSVP.hash(requests).then(data => {
        console.log(data);
        resolve(data);
      });
    });
  }
});
