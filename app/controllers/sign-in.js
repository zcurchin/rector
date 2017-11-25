import Ember from 'ember';
// import RSVP from 'rsvp';

const {
  Controller,
  inject: { service },
  get
} = Ember;


export default Controller.extend({
  session: service(),
  user: service(),
  firebaseApp: service(),
  error_msg: '',
  preloader: false,
  hideTemplate: false,

  actions: {
    signIn() {
      let self = this;
      let session = get(this, 'session');
      let user = get(this, 'user');

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
        self.set('hideTemplate', true);

        user.setup().then(() => {
          if (user.accountType.user) {
            self.replaceRoute('checking');

          } else if (user.accountType.business) {
            self.replaceRoute('ranking');
          }
        });

      }).catch(function(err){
        console.log(err);

        self.set('preloader', false);
        self.set('error_msg', err.message);
      });
    },


    forgottenPassword(){
      this.transitionToRoute('forgot-password');
    },


    signUp(){
      this.transitionToRoute('sign-up');
    },


    signUpBusiness(){
      this.transitionToRoute('sign-up-business');
    }
  }
});
