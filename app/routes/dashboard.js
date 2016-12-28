import Ember from 'ember';

export default Ember.Route.extend({
  model: function(){
    return {
      user_email: this.get('session.currentUser.email'),
      user_name: this.get('session.currentUser.displayName')
    };    
  }
});
