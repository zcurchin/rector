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

  pi_waiting: false,
  pi_success: false,
  pi_error: false,
  pi_errorMsg: '',


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

    set(self, 'pi_waiting', true);
    set(self, 'pi_error', false);
    set(self, 'pi_success', false);

    if (data.first_name === '') {
      set(self, 'pi_errorMsg', 'First name can\'t be blank');
      set(self, 'pi_error', true);

    } else if (data.last_name === '') {
      set(self, 'pi_errorMsg', 'Last name can\'t be blank');
      set(self, 'pi_error', true);

    } else if (data.username === '') {
      set(self, 'pi_errorMsg', 'Username can\'t be blank');
      set(self, 'pi_error', true);

    } else {
      firebaseApp.database().ref('userProfiles/'+ uid).update(data).then(() => {
        set(self, 'pi_success', true);

      }).catch(error => {
        set(self, 'pi_errorMsg', error);
        set(self, 'pi_error', true);
      });
    }
  },


  actions: {
    editProfile(){
      this.set('editPersonalInfo', true);
      this.populateFields();
    },


    saveUserProfile(){
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
        set(self, 'pi_waiting', true);
        set(self, 'pi_error', true);
        set(self, 'pi_errorMsg', 'No changes');

      } else if (propsChanged.indexOf('username') !== -1) {
        set(self, 'pi_waiting', true);

        user.isUsernameTaken(self.username).then(() => {
          // username if available
          return self.updateUserProfile(propsToUpdate);

        }).catch(error => {
          set(self, 'pi_success', false);
          set(self, 'pi_error', true);
          set(self, 'pi_errorMsg', error.message);
        });

      } else {
        self.updateUserProfile(propsToUpdate);
      }
    },


    editAvatar(){
      set(this, 'editingAvatar', true);
    },


    onAvatarChanged(data){
      set(this, 'model.profile.profile_image', data);
    }
  }
});
