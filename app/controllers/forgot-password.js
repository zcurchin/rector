import Ember from 'ember';

const {
  Controller,
  inject: { service }
} = Ember;

export default Controller.extend({
  firebaseApp: service(),
  error_msg: '',
  success_sent: false,
  preloader: false,

  actions: {
    resetPassword(){
      let self = this;
      let firebase = this.get('firebaseApp');
      let email = this.get('email');

      this.set('preloader', true);

      firebase.auth().sendPasswordResetEmail(email).then(() => {
        self.set('preloader', false);
        self.set('success_sent', true);

      }).catch(err => {
        self.set('preloader', false);
        self.set('error_msg', err.message);
      });
    },

    cancel(){
      this.set('error_msg', '');
      this.set('email', '');
      this.set('success_sent', false);

      window.history.back();
    }
  }
});
