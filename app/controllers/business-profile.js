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
    'name',
    'address'
  ],

  pi_waiting: false,
  pi_success: false,
  pi_error: false,
  pi_errorMsg: '',


  populateFields(){
    let self = this;
    let model = this.get('model');

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

    // console.log('###### updateBusinessProfile :', data);

    if (data.name === '') {
      set(self, 'pi_errorMsg', 'Business name can\'t be blank');
      set(self, 'pi_error', true);

    } else {
      firebaseApp.database().ref('businessProfiles/'+ uid).update(data).then(() => {
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


    saveBusinessProfile(){
      let self = this;
      let model = this.get('model');
      let propsChanged = [];
      let propsToUpdate = {};

      console.log('##### SAVE PROFILE');

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

      } else {
        self.updateUserProfile(propsToUpdate);
      }
    },


    editAvatar(){
      set(this, 'editingAvatar', true);
    },


    onAvatarChanged(data){
      set(this, 'model.profile_image', data);
    }
  }
});
