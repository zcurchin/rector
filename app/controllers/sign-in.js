import Ember from 'ember';

const {
  Controller,
  inject: { service }
} = Ember;


export default Controller.extend({
  firebaseApp: service(),
  error_msg: '',

  actions: {
    signIn() {
      var self = this;

      this.get('session').open('firebase', {
        provider: 'password',
        email: self.get('email'),
        password: self.get('password')

      }).then(function() {
        //console.log('*********');
        self.set('email', '');
        self.set('password', '');
        self.set('error_msg', '');
        self.replaceRoute('profile');

      }).catch(function(err){
        self.set('error_msg', err.message);
      });
    },

    signUp(){
      this.transitionToRoute('sign-up');
    },

    forgottenPassword(){
      this.transitionToRoute('forgot-password');
    }
  }
});
