import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Service,
  inject: { service },
  get,
  set
} = Ember;

export default Service.extend({
  session: service(),
  firebaseApp: service(),
  firebaseUtil: service(),

  create(params){
    let self = this;

    return new RSVP.Promise((resolve, reject) => {
      self._createFirebaseUser(params.email, params.password).then((user) => {
        console.log('# 1 : created : firebase user');

        let uid = user.uid;

        let tasks = {
          account: self._createAccount(uid, params),
          profile: self._createProfile(uid, params)
        };

        RSVP.hash(tasks).then(() => {
          console.log('# 2 : created : account and profile');
          resolve();

        }).catch(err => {
          reject(err);
        });

      }).catch(err => {
        reject(err);
      });
    });
  },


  _createFirebaseUser(email, pass){
    let auth = get(this, 'firebaseApp').auth();

    return auth.createUserWithEmailAndPassword(email, pass);
  },


  // --------------------------------------------
  // Create Business Account
  // --------------------------------------------

  _createAccount(uid, params){
    let firebaseApp = get(this, 'firebaseApp');
    let businessAccounts = firebaseApp.database().ref('businessAccounts');

    let data = {
      created: Date.now(),
      active: false
    };

    return businessAccounts.child(uid).set(data);
  },


  // --------------------------------------------
  // Create Business Profile
  // --------------------------------------------

  _createProfile(uid, params){
    let firebaseApp = get(this, 'firebaseApp');
    let businessProfiles = firebaseApp.database().ref('businessProfiles');

    let data = {
      created: new Date().getTime(),
      name: params.name,
      address: '',
      profile_image: ''
    };

    return businessProfiles.child(uid).set(data);
  }
});
