import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },


  model: function(){
    //var self = this;
    let isAuthenticated = this.get('session').get('isAuthenticated');
    console.log('# Route : Application : isAuthenticated:', isAuthenticated);

    if (!isAuthenticated) {
      this.replaceWith('sign-in');
    }
  },


  afterModel: function(model, transition) {
    let target = Ember.get(transition, 'targetName');
    let isAuthenticated = this.get('session').get('isAuthenticated');
    console.log('# Route : Application : target :', target);

    if (isAuthenticated && (target === 'index' || target === 'sign-in' || target === 'sign-up')) {
      this.replaceWith('profile');
    }
  }
});
