import Ember from 'ember';

const {
  Controller,
  inject: { service },
  set,
  get
} = Ember;

export default Controller.extend({
  user: service(),
  firebaseApp: service(),

  editingProfile: false,

  showDialog: false,

  personalInfoProps: [
    'first_name',
    'last_name',
    'username',
    'country',
    'state',
    'city',
    'zipcode'
  ],

  error_msg: '',
  preloader: false,

  populateFields(){
    let self = this;
    let model = this.get('model.profile');

    this.personalInfoProps.forEach(prop => {
      self.set(prop, model[prop]);
    });
  },


  resetFields(){

  },

  updateUserProfile(data){
    let self = this;
    let uid = get(this, 'session.currentUser.uid');
    let firebaseApp = get(this, 'firebaseApp');

    set(this, 'preloader', true);

    firebaseApp.database().ref('userProfiles/'+ uid).update(data).then(() => {
      set(self, 'preloader', false);
      set(self, 'editingProfile', false);

    }).catch(error => {
      set(self, 'preloader', false);
      set(self, 'error_msg', error);
    });
  },

  actions: {
    editProfile(){
      this.set('editingProfile', true);
      this.populateFields();
    },

    saveProfile(){
      let self = this;
      let user = get(this, 'user');
      let model = this.get('model.profile');
      let propsChanged = [];
      let propsToUpdate = {};

      this.personalInfoProps.forEach(prop => {
        if (model[prop] !== self[prop]) { propsChanged.push(prop); }
      });

      propsChanged.forEach(prop => {
        propsToUpdate[prop] = self[prop];
      });

      console.log(propsChanged);
      console.log(propsToUpdate);

      if (propsChanged.length === 0) {
        set(self, 'preloader', false);
        set(self, 'editingProfile', false);

      } else if (propsChanged.indexOf('username') !== -1) {
        user.isUsernameTaken(self.username).then(() => {
          // username if available
          self.updateUserProfile(propsToUpdate);

        }).catch(error => {
          set(self, 'error_msg', error.message);
        });

      } else {
        self.updateUserProfile(propsToUpdate);
      }
    },

    cancelEditProfile(){
      this.set('editingProfile', false);
      this.set('error_msg', '');
    },

    editProfilePicture(){
      // let model = this.get('model');
      // set(model, 'profile.profile_image', 'http://lorempixel.com/400/200');

      set(this, 'showDialog', true);
    }
  }
});
