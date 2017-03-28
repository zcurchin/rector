import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get,
  set
} = Ember;


export default Controller.extend({
  user: service(),
  editEmail: false,
  newEmail: '',
  password: '',
  reauth: false,

  actions: {
    editEmail(){
      this.set('editEmail', true);
    },

    cancelEditEmail(){
      this.set('editEmail', false);
      this.set('newEmail', '');
    },

    saveNewEmail(){
      let user = get(this, 'session.currentUser');
      let newEmail = get(this, 'newEmail');

      if (newEmail && newEmail !== '') {
        user.updateEmail(newEmail).then(data => {
          console.log(data);

        }).catch(err => {
          console.log(err);

          if (err.code === 'auth/requires-recent-login') {
            set(this, 'reauth', true);
          }
        });
      }
    }
  }
});
