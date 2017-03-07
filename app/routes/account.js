import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  user: service(),

  model(){
    let user = get(this, 'user');

    return user.get('account');
  }
});
