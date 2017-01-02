import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get,
  set,
  run
} = Ember;

export default Controller.extend({
  store: service(),
  session: service(),
  firebaseApp: service(),
  wiatForAccountCreation: false,
  error_msg: '',

  actions: {
    createAccount: function(){
      var self = this;
      let auth = this.get('firebaseApp').auth();

      let first_name = this.get('first_name');
      let last_name = this.get('last_name');
      let email = this.get('email');
      let pass = this.get('password');

      if (!email) {
        set(self, 'error_msg', 'Email address can\'t be blank');
        return;
      } else if (!pass) {
        set(self, 'error_msg', 'Passord can\'t be blank');
        return;
      }

      set(this, 'wiatForAccountCreation', true);

      auth.createUserWithEmailAndPassword(email, pass).then((currentUser) => {

        let user = get(self, 'store').createRecord('user', {
          uid: currentUser.uid,
          first_name: first_name,
          last_name: last_name,
          email: email
        });

        user.save().then((_user) => {
          // console.log(_user);
          self.get('session').open('firebase', {
            provider: 'password',
            email: email,
            password: pass

          }).then(function() {
            set(self, 'wiatForAccountCreation', false);
            self.transitionToRoute('dashboard');

          }).catch(function(err){
            set(self, 'wiatForAccountCreation', false);
            self.set('error_msg', err.message);
          });
        });

      }).catch((err) => {
        set(self, 'wiatForAccountCreation', false);
        set(self, 'error_msg', err.message);
      });
    },

    goToSignIn(){
      this.transitionToRoute('sign-in');
    }
  }
});
