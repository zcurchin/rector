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
  session: service(),
  paperToaster: service(),

  currentEmail: '',
  emailVerified: false,
  editEmail: false,
  newEmail: '',
  verifyEmailSent: false,

  newPassword: '',
  editPassword: false,
  password: '',
  passwordChanged: false,

  error_msg: '',
  success_msg: '',
  preloader: false,
  preloader2: false,


  loginUser(){
    let firebase = get(this, 'firebaseApp');
    let pass = get(this, 'password');
    let email = get(this, 'session.currentUser.email');
    //let emailVerified = get(this, 'session.currentUser.emailVerified');

    return new RSVP.Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, pass).then(() => {
        resolve();
      }).catch((error) => {
        reject(error.message);
      });
    });
  },


  clearEmailForm(){
    this.set('newEmail', '');
    this.set('password', '');
    this.set('success_msg', '');
    this.set('error_msg', '');
    this.set('editEmail', false);
  },


  clearPasswordForm(){
    this.set('newPassword', '');
    this.set('password', '');
    this.set('success_msg', '');
    this.set('error_msg', '');
    this.set('passwordChanged', false);
    this.set('editPassword', false);
  },


  clearForms(){
    this.clearEmailForm();
    this.clearPasswordForm();
  },


  actions: {
    // EMAIL
    editEmail(){
      this.set('editEmail', true);
      this.clearPasswordForm();
    },


    verifyEmail(){
      let self = this;
      let user = get(this, 'session.currentUser');
      let paperToaster = get(this, 'paperToaster');

      set(self, 'preloader2', true);

      user.sendEmailVerification().then(() => {
        set(self, 'preloader2', false);
        set(self, 'verifyEmailSent', true);

        let message = 'Verification sent, please check your email.';

        paperToaster.show(message, {
          duration: 7000,
          position: 'bottom right'
        });

      }).catch(error => {
        set(self, 'preloader2', false);
        let message = error.message;

        console.log(error.message);

        paperToaster.show(message, {
          duration: 7000,
          position: 'bottom right'
        });
      });
    },


    cancelEditEmail(){
      this.clearEmailForm();
    },


    saveNewEmail(){
      let self = this;
      let user = get(this, 'session.currentUser');
      let newEmail = get(this, 'newEmail');

      set(this, 'preloader', true);

      this.loginUser().then(() => {
        user.updateEmail(newEmail).then(() => {
          //let msg = 'You successfully changed your email address.';
          set(self, 'preloader', false);
          set(self, 'currentEmail', user.email);
          set(self, 'emailVerified', user.emailVerified);

        }).catch(err => {
          set(self, 'preloader', false);
          set(self, 'error_msg', err);
        });

      }).catch(err => {
        set(self, 'preloader', false);
        set(self, 'error_msg', err);
      });
    },


    // PAASWORD
    forgotPassword(){
      this.transitionToRoute('forgot-password');
    },


    editPassword(){
      this.set('editPassword', true);
      this.clearEmailForm();
    },


    cancelEditPassword(){
      this.clearPasswordForm();
    },


    saveNewPassword(){
      let self = this;
      let user = get(this, 'session.currentUser');
      let newPassword = get(this, 'newPassword');

      set(this, 'preloader', true);

      this.loginUser().then(() => {
        user.updatePassword(newPassword).then(() => {
          set(self, 'password', '');
          set(self, 'newPassword', '');
          set(self, 'preloader', false);
          set(self, 'passwordChanged', true);
          set(self, 'success_msg', 'You successfully changed you password');

        }).catch(err => {
          set(self, 'preloader', false);
          set(self, 'error_msg', err);
        });

      }).catch(err => {
        set(self, 'preloader', false);
        set(self, 'error_msg', err);
      });
    }
  }
});
