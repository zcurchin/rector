import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    signIn: function() {
      var self = this;

      // email: test@example.com
      // pass: password1234

      this.get('session').open('firebase', {
        provider: 'password',
        email: self.get('email'),
        password: self.get('password')

      }).then(function() {
        // console.log(data.currentUser);

        self.transitionToRoute('dashboard');

        // data.currentUser.updateProfile({
        //   displayName: "Jane Q. User",
        //   photoURL: "https://example.com/jane-q-user/profile.jpg",
        //   testParam: 'hallo there'
        // }).then(function() {
        //   // Update successful.
        // }, function(error) {
        //   // An error happened.
        // });

        //console.log(self.get('session'));


      }).catch(function(err){
        console.log(err);
      });
    }
  }
});
