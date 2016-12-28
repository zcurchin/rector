import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function() {
    return this.get('session').fetch().catch(function() {});
  },

  model: function(){
    var self = this;
    var isAuthenticated = this.get('session').get('isAuthenticated');
    console.log('isAuthenticated:', isAuthenticated);

    if (isAuthenticated) {
      this.transitionTo('dashboard');
    } else {
      this.transitionTo('sign-in');
    }    
  }
});
