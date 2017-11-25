import Ember from 'ember';
//import RSVP from 'rsvp';

const {
  inject: { service },
  get,
  Route
} = Ember;


export default Route.extend({
  //session: service(),
  user: service(),
  //firebaseApp: service(),

  model(){
    let user = get(this, 'user');

    return user.get('businessProfile');
  }
});
