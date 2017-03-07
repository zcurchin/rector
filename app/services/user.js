import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Service,
  inject: { service },
  get
} = Ember;


export default Service.extend({
  session: service(),
  firebaseApp: service(),
  firebaseUtil: service(),

  create(params){
    let self = this;

    return new RSVP.Promise((resolve, reject) => {
      self._createFirebaseUser(params.email, params.password).then((user) => {
        let uid = user.uid;
        let tasks = {
          account: self._createAccount(uid, params),
          profile: self._createProfile(uid, params)
        };

        console.log('# User : created : firebase user');

        return RSVP.hash(tasks);

      }).then(() => {
        resolve();

      }).catch(error => {
        reject(error);
      });
    });
  },


  destroy(){},


  get(dataKey){
    let uid = get(this, 'session.currentUser.uid');
    let emailVerified = get(this, 'session.currentUser.emailVerified');
    let firebaseUtil = get(this, 'firebaseUtil');

    let dbRef;

    switch (dataKey) {
      case 'profile':
        dbRef = 'userProfiles';
      break;
      case 'account':
        dbRef = 'userAccounts';
      break;
      case 'publicGrades':
        dbRef = 'publicGrades';
      break;
      case 'privateGrades':
        dbRef = 'privateGrades';
      break;
    }

    console.log('# User : get : '+dbRef+' :', uid);

    return new RSVP.Promise((resolve, reject) => {
      firebaseUtil.findRecord(dbRef, dbRef + '/' + uid).then(data => {
        if (dataKey === 'account') {
          data.email_verified = emailVerified;
        }
        resolve(data);

      }).catch(error => {
        reject(error);
      });
    });
  },


  // --------------------------------------------
  // Create Firebase User
  // --------------------------------------------

  _createFirebaseUser(email, pass){
    let auth = get(this, 'firebaseApp').auth();

    return auth.createUserWithEmailAndPassword(email, pass);
  },


  // --------------------------------------------
  // Create Basic User
  // --------------------------------------------

  _createAccount(uid, params){
    let firebaseApp = get(this, 'firebaseApp');
    let userAccounts = firebaseApp.database().ref('userAccounts');

    let data = {
      created: Date.now(),
      updated: '',
      email: params.email
    };

    return userAccounts.child(uid).set(data);
  },


  _createProfile(uid, params){
    let firebaseApp = get(this, 'firebaseApp');
    let userProfiles = firebaseApp.database().ref('userProfiles');

    let data = {
      created: Date.now(),
      updated: '',
      first_name: params.first_name,
      last_name: params.last_name,
      username: params.username,
      country: '',
      state: '',
      city: '',
      zipcode: '',
      profile_image: '',
      restaurant: ''
    };

    return userProfiles.child(uid).set(data);
  },


  // --------------------------------------------
  // Create Admin User
  // --------------------------------------------

  _createAdminAccount(auth_uid, email){}

});
