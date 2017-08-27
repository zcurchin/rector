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

  checkedIn: false,

  restaurant: '',

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
    }

    console.log('# User : get : '+dbRef+' :', uid);

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


  // --------------------------------------------
  // Checking
  // --------------------------------------------

  isCheckedIn(){
    let self = this;

    this.getLastCheckIn().then(data => {
      // console.log(data.val());
      // console.log(data.val()[keys[0]]);

      if (data.val()) {
        let keys = Object.keys(data.val());
        let obj = data.val()[keys[0]];
        
        if (obj.out > Date.now()) {
          set(self, 'checkedIn', true);
        } else {
          set(self, 'checkedIn', false);
        }

      } else {
        set(self, 'checkedIn', false);
      }
    });
  },


  checkIn(checkOut){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let checkIns = firebaseApp.database().ref('checkIns');
    let uid = get(this, 'session.currentUser.uid');

    let data = {
      in: Date.now(),
      out: checkOut,
      restaurant: self.restaurant
    };

    set(self, 'checkedIn', true);

    return checkIns.child(uid).push(data);
  },


  checkOut(timestamp, type){
    let self = this;

    return this.getLastCheckIn().then(data => {
      let uid = get(this, 'session.currentUser.uid');
      let checkIn_id = Object.keys(data.val())[0];
      let firebaseApp = get(this, 'firebaseApp');
      let checkInRef = firebaseApp.database().ref('checkIns/'+uid+'/'+checkIn_id);

      if (type !== 'update') {
        set(self, 'checkedIn', false);
      }

      let outTime = timestamp || Date.now();

      return checkInRef.update({
        out: outTime
      });
    });
  },


  getCheckIns(){
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session.currentUser.uid');
    let checkIns = firebaseApp.database().ref('checkIns');
    let userCheckins = checkIns.child(uid);

    return userCheckins.orderByKey().limitToLast(10).once('value');
  },


  getLastCheckIn(){
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session.currentUser.uid');
    let checkIns = firebaseApp.database().ref('checkIns');
    let userCheckins = checkIns.child(uid);

    return userCheckins.orderByKey().limitToLast(1).once('value');
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
      type: params.admin ? 'admin' : 'user'
    };

    return userAccounts.child(uid).set(data);
  },


  // --------------------------------------------
  // Create Profile
  // --------------------------------------------

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

  _createAdminAccount(auth_uid, email){
    console.log(auth_uid, email);
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
