import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get
} = Ember;


export default Controller.extend({
  session: service(),
  firebaseApp: service(),
  error_msg: '',
  preloader: false,

  actions: {
    signIn() {
      let self = this;
      let session = get(this, 'session');

      self.set('preloader', true);

      session.open('firebase', {
        provider: 'password',
        email: self.get('email'),
        password: self.get('password')

      }).then(function() {
        self.set('email', '');
        self.set('password', '');
        self.set('error_msg', '');

        self.set('preloader', false);

        self.replaceRoute('checking');

      }).catch(function(err){
        console.log(err);

        self.set('preloader', false);
        self.set('error_msg', err.message);
      });
    },

    signUp(){
      this.transitionToRoute('sign-up');
    },

    signUpRestaurant(){
      this.transitionToRoute('sign-up-restaurant');
    },

    forgottenPassword(){
      this.transitionToRoute('forgot-password');
    }
  }
});
