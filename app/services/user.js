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

  checking: service(),
  workplace: service(),
  grading: service(),
  ranking: service(),
  notifications: service(),
  employees: service(),

  accountType: {
    user: false,
    business: false,
    admin: false
  },


  create(params){
    let self = this;

    return new RSVP.Promise((resolve, reject) => {
      self.isUsernameTaken(params.username).then(() => {
        console.log('##### 1 : isUsernameTaken');
        return true;

      }).then(() => {
        console.log('##### 2 : _createFirebaseUser');

        return self._createFirebaseUser(params.email, params.password).then((user) => {
          let uid = user.uid;
          let tasks = {
            account: self._createAccount(uid, params),
            profile: self._createProfile(uid, params)
          };

          console.log('##### 3 : created : firebase user');

          return RSVP.hash(tasks).then(() => {
            resolve();
          });
        });

      }).catch(error => {
        reject(error);
      });
    });
  },


  get(dataKey, _uid){
    let session = get(this, 'session');
    let currentUser = session.get('currentUser');
    let uid = _uid || currentUser.uid;
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
      case 'businessProfile':
        dbRef = 'businessProfiles';
      break;
    }

    console.log('# Service : User : get : '+dbRef+' :', uid);

    return new RSVP.Promise((resolve, reject) => {
      firebaseUtil.findRecord(dbRef, dbRef + '/' + uid).then(data => {

        if (dataKey === 'publicGrades') {
          let _data = [];

          Object.keys(data).forEach(key => {
            if (key.indexOf('-') !== -1) {
              _data.push(data[key]);
            }
          });

          resolve(_data);

        } else {
          resolve(data);
        }

      }).catch(error => {
        reject(error);
      });
    });
  },


  setAccountType(){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let userProfilesRef = firebaseApp.database().ref('userProfiles');
    let businessProfilesRef = firebaseApp.database().ref('businessProfiles');
    let session = get(this, 'session');
    let user_uid = session.get('currentUser').uid;

    console.log('# Service : User : setAccountType');

    return new RSVP.Promise((resolve) => {

      userProfilesRef.child(user_uid).once('value').then(snap => {
        let userProfile = snap.val();

        if (userProfile) {
          console.log('# Service : User : accountType : user');
          set(self, 'accountType.user', true);
          resolve();

        } else {
          businessProfilesRef.child(user_uid).once('value').then(snap => {
            let businessProfile = snap.val();

            if (businessProfile) {
              console.log('# Service : User : accountType : business');
              set(self, 'accountType.business', true);
              resolve();
            }
          });
        }
      });

      // self.get('profile').then(profile => {
      //   console.log('# Service : User : profile :', Object.keys(profile).length > 0);
      //
      //   if (Object.keys(profile).length > 0) {
      //     console.log('# Service : User : accountType : user');
      //     set(self, 'accountType.user', true);
      //     resolve();
      //
      //   } else {
      //     console.log('# Service : User : setAccountType : check businessProfiles');
      //     self.get('businessProfile').then(businessProfile => {
      //       console.log('business profile:', Object.keys(businessProfile).length > 0);
      //
      //       if (Object.keys(businessProfile).length > 0) {
      //         set(self, 'accountType.business', true);
      //         console.log('# Service : User : accountType : business');
      //         resolve();
      //       }
      //     });
      //   }

      // }).catch(err => {
      //   reject(err);
      // });
    });
  },


  setup(){
    let self = this;

    console.log('------------------------------------');
    console.log('# Service : User : setup');
    console.log('------------------------------------');

    let workplace = get(self, 'workplace');
    let notifications = get(self, 'notifications');
    let employees = get(self, 'employees');
    let checking = get(self, 'checking');
    let grading = get(self, 'grading');
    let ranking = get(self, 'ranking');

    return new RSVP.Promise((resolve, reject) => {
      self.setAccountType().then(() => {
        if (get(self, 'accountType.user')) {
          workplace.initialize().then(() => {
            checking.initialize().then(() => {
              grading.initialize();
            });
            ranking.initialize();
            notifications.initialize();
            resolve();
          });

        } else {
          workplace.initialize().then(() => {
            employees.initialize();
            notifications.initialize();
            ranking.initialize();
            resolve();
          });
        }
      }).catch(err => {
        reject(err);
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
  // Create User Account
  // --------------------------------------------

  _createAccount(uid){
    let firebaseApp = get(this, 'firebaseApp');
    let userAccounts = firebaseApp.database().ref('userAccounts');

    let data = {
      created: new Date().getTime()
    };

    return userAccounts.child(uid).set(data);
  },


  // --------------------------------------------
  // Create User Profile
  // --------------------------------------------

  _createProfile(uid, params){
    let firebaseApp = get(this, 'firebaseApp');
    let userProfiles = firebaseApp.database().ref('userProfiles');

    let data = {
      created: new Date().getTime(),
      first_name: params.first_name,
      last_name: params.last_name,
      username: params.username,
      profile_image: ''
    };

    return userProfiles.child(uid).set(data);
  },


  // --------------------------------------------
  // Update Email
  // --------------------------------------------

  updateEmail(address){
    //let self = this;
    let currentUser = get(this, 'session.currentUser');

    return new RSVP.Promise((resolve, reject) => {
      currentUser.updateEmail(address).then(data => {
        console.log('# User : Email Updated :', address);
        console.log(data);
        resolve(data);

      }).catch(error => {
        reject(error);
      });
    });
  },


  // --------------------------------------------
  // Helpers
  // --------------------------------------------

  isUsernameTaken(username){
    let firebaseApp = get(this, 'firebaseApp');
    let userProfiles = firebaseApp.database().ref('userProfiles');

    return new RSVP.Promise((resolve, reject) => {
      userProfiles.orderByChild('username').equalTo(username).once('value').then(d => {
        if (d.val()) {
          console.log('--- isUsernameTaken : ', true);
          reject({ message: 'This username is already taken' });
        } else {
          console.log('--- isUsernameTaken : ', false);
          resolve();
        }
      });
    });
  }
});
