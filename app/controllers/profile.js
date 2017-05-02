import Ember from 'ember';

const {
  Controller,
  inject: { service },
  set,
  get
} = Ember;

export default Controller.extend({
  firebaseApp: service(),

  editingProfile: false,

  firstName: '',
  lastName: '',
  username: '',
  country: '',
  state: '',
  city: '',
  zipcode: '',

  populateFields(){
    let model = this.get('model');
    this.set('firstName', model.profile.first_name);
    this.set('lastName', model.profile.last_name);
    this.set('username', model.profile.username);
    this.set('country', model.profile.country);
    this.set('state', model.profile.state);
    this.set('city', model.profile.city);
    this.set('zipcode', model.profile.zipcode);

  },

  resetFields(){
    this.set('firstName', '');
    this.set('lastName', '');
    this.set('username', '');
    this.set('country', '');
    this.set('state', '');
    this.set('city', '');
    this.set('zipcode', '');
  },

  actions: {
    editProfile(){
      this.set('editingProfile', true);
      this.populateFields();
    },

    saveProfile(){
      let user = get(this, 'session.currentUser');
      let firebase = get(this, 'firebaseApp');

      console.log(user.uid);

      this.get('firstName');
      this.get('lastName');
      this.get('username');
      this.get('country');
      this.get('state');
      this.get('city');
      this.get('zipcode');

      // firebase.database().ref().update({
      //   'userAccounts/'
      // });
    },

    cancelEditProfile(){
      this.set('editingProfile', false);
    },

    editProfilePicture(){
      let model = this.get('model');

      set(model, 'profile.profile_image', 'http://lorempixel.com/400/200');
    }
  }
});
