import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Controller,
  inject: { service },
  get,
  set
} = Ember;


export default Controller.extend({
  user: service(),
  firebaseApp: service(),
  editEmail: false,
  newEmail: '',
  password: '',
  error_msg_email: '',


  loginUser(){
    let self = this;
    let firebase = get(this, 'firebaseApp');
    let pass = get(this, 'password');
    let email = get(this, 'session.currentUser.email');
    let emailVerified = get(this, 'session.currentUser.emailVerified');
    console.log(emailVerified);

    return new RSVP.Promise((resolve, reject) => {

      if (!emailVerified) {
        reject('Your email address is not verified. Verify your email address in order to complete this task.');
      }

      firebase.auth().signInWithEmailAndPassword(email, pass).then(() => {
        resolve();
      }).catch((error) => {
        reject(error.message);
      });
    });
  },

  actions: {
    editEmail(){
      this.set('editEmail', true);
    },

    cancelEditEmail(){
      this.set('editEmail', false);
      this.set('newEmail', '');
      this.set('error_msg_email', '');
      this.set('password', '');
    },

    saveNewEmail(){
      let user = get(this, 'session.currentUser');
      let newEmail = get(this, 'newEmail');

      this.loginUser().then(() => {
        user.updateEmail(newEmail).then(data => {
          console.log(data);

        }).catch(err => {
          console.log(err);
          set(this, 'error_msg_email', err);
        });

      }).catch(err => {
        set(this, 'error_msg_email', err);
      });
    }
  }
});
