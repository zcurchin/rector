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
  }
});
