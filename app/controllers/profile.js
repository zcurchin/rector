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
  avatar: service(),

  editPersonalInfo: false,
  editingAvatar: false,
  editingProfile: false,
  showAvatarDialog: false,

  personalInfoProps: [
    'first_name',
    'last_name',
    'username',
    'country',
    'state',
    'city',
    'zipcode'
  ],

  waiting: false,
  waitingSuccess: false,
  waitingError: false,
  waitingErrorMsg: '',
  waitingSuccessMsg: 'Successfully saved personal info',


  populateFields(){
    let self = this;
    let model = this.get('model.profile');

    this.personalInfoProps.forEach(prop => {
      self.set(prop, model[prop]);
    });
  },


  updateUserProfile(data){
    let self = this;
    let uid = get(this, 'session.currentUser.uid');
    let firebaseApp = get(this, 'firebaseApp');

    set(self, 'waiting', true);
    set(self, 'waitingError', false);
    set(self, 'waitingSuccess', false);

    firebaseApp.database().ref('userProfiles/'+ uid).update(data).then(() => {
      set(self, 'waitingSuccess', true);

    }).catch(error => {
      set(self, 'waitingErrorMsg', error);
      set(self, 'waitingError', true);
    });
  },


  closeWaiting(){
    set(this, 'waiting', false);
    set(this, 'waitingSuccess', false);
    set(this, 'waitingError', false);
  },


  actions: {
    editProfile(){
      this.set('editPersonalInfo', true);
      this.populateFields();
    },


    onClosed(){
      this.closeWaiting();
    },


    closeWaiting(){
      set(this, 'waiting', false);
      set(this, 'waitingSuccess', false);
      set(this, 'waitingError', false);
    },


    cancelEditProfile(){
      this.set('editPersonalInfo', false);
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
        set(self, 'waiting', true);
        set(self, 'waitingError', true);
        set(self, 'waitingErrorMsg', 'You did not changed anything');

      } else if (propsChanged.indexOf('username') !== -1) {
        set(self, 'waiting', true);

        user.isUsernameTaken(self.username).then(() => {
          // username if available
          return self.updateUserProfile(propsToUpdate);

        }).catch(error => {
          set(self, 'waitingSuccess', false);
          set(self, 'waitingError', true);
          set(self, 'waitingErrorMsg', error.message);
        });

      } else {
        self.updateUserProfile(propsToUpdate);
      }
    },


    editAvatar(){
      let avatar = get(this, 'avatar');
      avatar.open();
    },


    editProfilePicture(){
      set(this, 'editingAvatar', true);
    },


    onAvatarChanged(data){
      set(this, 'model.profile.profile_image', data);
    }
  }
});
