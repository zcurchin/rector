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
    var self = this;
    let target = Ember.get(transition, 'targetName');
    let isAuthenticated = this.get('session').get('isAuthenticated');
    console.log('# Route : Application : target :', target);

    if (!isAuthenticated) {
      this.replaceWith('sign-in');

    } else {
      let user = get(this, 'user');

      user.setup().then(() => {
        //console.log('get(self, "accountType.user")', user.accountType.user);

        if (user.accountType.user) {
          if (target === 'index' || target === 'sign-in' || target === 'sign-up') {
            this.replaceWith('checking');
          }

        } else if (user.accountType.business) {
          if (target === 'index' || target === 'sign-in' || target === 'sign-up') {
            this.replaceWith('ranking');
          }
        }
      });
    }
  }
});
