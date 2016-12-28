import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {    

    signOut: function() {
      this.get('session').close();
      this.transitionToRoute('sign-in');
    },

    signUp: function(){
      this.transitionToRoute('sign-up');
    //   var self = this;
    //
    //   this.store.query('user', {orderBy: 'uid', equalTo: uid }).then( (records) => {
    //     if (records.get('length') === 0) {
    //       self.store.createRecord('user', {
    //         uid: uid,
    //         email: username,
    //         avatar: avatar
    //       });
    //     }
    //
    //     else{
    //       records.get('firstObject');
    //     }
    //   });
    }
  }
});
