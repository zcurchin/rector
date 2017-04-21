import Ember from 'ember';

const {
  Controller,
  inject: { service }
} = Ember;

export default Controller.extend({
  firebaseApp: service(),
  error_msg: '',
  success_sent: false,

  actions: {
    resetPassword(){
      console.log('Hallo');
      let firebase = this.get('firebaseApp');
      let email = this.get('email');
      let self = this;

      firebase.auth().sendPasswordResetEmail(email).then(() => {
        self.set('success_sent', true);

      }).catch(err => {
        this.set('error_msg', err.message);
      });
    },

    cancel(){
      this.transitionToRoute('sign-in');
    }
  }
});
