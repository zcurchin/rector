import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  user: service(),


  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },


  afterModel: function(model, transition) {
    let target = Ember.get(transition, 'targetName');
    let isAuthenticated = this.get('session').get('isAuthenticated');
    console.log('# Route : Application : target :', target);

    if (!isAuthenticated) {
      this.replaceWith('sign-in');

    } else {
      let user = get(this, 'user');
      user.setup();

      if (target === 'index' || target === 'sign-in' || target === 'sign-up') {
        this.replaceWith('checking');
      }

    }
  }
});
