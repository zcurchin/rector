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
  },

  setupController(controller, model){
    this._super(controller, model);
    let email = get(this, 'session.currentUser.email');
    let verified = get(this, 'session.currentUser.emailVerified');

    controller.set('currentEmail', email);
    controller.set('emailVerified', verified);
  },

  deactivate(){
    this.controller.clearForms();
  }
});
