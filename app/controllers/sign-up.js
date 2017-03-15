import Ember from 'ember';

const {
  Controller,
  inject: { service },
  set
} = Ember;


export default Controller.extend({
  user: service(),
  wiatForAccountCreation: false,
  error_msg: '',
  createAdmin: false,

  actions: {
    createUser(){
      let self = this;
      let first_name = this.get('first_name');
      let last_name = this.get('last_name');
      let username = this.get('username');
      let email = this.get('email');
      let pass = this.get('password');
      let createAdmin = this.get('createAdmin');
      let user = this.get('user');

      set(this, 'wiatForAccountCreation', true);

      let params = {
        admin: createAdmin,
        email: email,
        password: pass,
        username: username,
        first_name: first_name,
        last_name: last_name
      };

      user.create(params).then(() => {
        console.log('# Sign Up : user data created');

        self.get('session').open('firebase', {
          provider: 'password',
          email: email,
          password: pass

        }).then(function() {
          console.log('# Sign Up : user logged in');
          set(self, 'wiatForAccountCreation', false);
          self.replaceRoute('dashboard');

        }).catch(function(err){
          console.log(err);
          set(self, 'wiatForAccountCreation', false);
          set(self, 'error_msg', err.message);
        });


      }).catch((err) => {
        console.log(err);
        set(self, 'wiatForAccountCreation', false);
        set(self, 'error_msg', err.message);
      });
    },


    goToSignIn(){
      this.transitionToRoute('sign-in');
    }
  }
});
