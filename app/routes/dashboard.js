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
      let requests = {
        profile: user.get('profile'),
        account: user.get('account')
      };

      RSVP.hash(requests).then(data => {
        console.log(data);
        resolve(data);
      });
    });
  }
});
