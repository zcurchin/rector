import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Service,
  inject: { service },
  get,
  set
} = Ember;


export default Service.extend({
  firebaseApp: service(),
  session: service(),
  employees: service(),
  checking: service(),
  notifications: service(),
  user: service(),
  store: service(),

  data: null,
  ready: false,
  active: false,


  _onReadyFunctions: [],


  _isReady(){
    let funcs = get(this, '_onReadyFunctions');

    if (funcs.length === 1) {
      funcs[0]();

    } else if (funcs.length > 1) {
      funcs.forEach(fn => {
        fn();
      });
    }
  },


  onReady(func){
    this._onReadyFunctions.addObject(func);
  },


  initialize(){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    // let employees = get(this, 'employees');
    let user = get(this, 'user');
    //let checking = get(this, 'checking');
    let uid = get(this, 'session.currentUser.uid');
    let userWorkplaces = firebaseApp.database().ref('userWorkplaces').child(uid);

    console.log('------------------------------------');
    console.log('# Service : Workplace : initialize');
    console.log('------------------------------------');

    // console.log('# Service : Workplace : USER is BUSINESS :', user.accountType.business);

    return new RSVP.Promise((resolve) => {
      // user is business so set workplace proprely
      if (user.accountType.business) {
        set(this, 'active', true);
        set(this, 'ready', true);
        // set(this, 'data', )
        self._isReady();
        resolve();
        return;
      }

      userWorkplaces.on('value', snap => {
        let val = snap.val();

        if (val) {
          let keys = Object.keys(val);

          keys.forEach((key) => {
            let pending = val[key].pending;
            //console.log('# Service : Workplace : pending :', val[key].pending);

            let businessProfiles = firebaseApp.database().ref('businessProfiles').child(key);
            let businessEmployees = firebaseApp.database().ref('businessEmployees').child(key).child(uid);

            businessProfiles.once('value', snap => {
              //console.log('# Service : Workplace : businessProfile :', snap.val());

              let businessObj = snap.val();

              if (pending) {
                businessObj.pending = true;
                businessObj.business_id = snap.key;
                businessObj.request_id = val[key].request_id;
                set(self, 'data', businessObj);
                set(self, 'ready', true);

                console.log('# Service : Workplace : active :', false);
                console.log('# Service : Workplace : READY');

                self._isReady();

                resolve(businessObj);

              } else {
                businessEmployees.once('value', snap => {
                  //console.log('businessEmployees :', snap.val());

                  if (!snap.val()) {
                    set(self, 'data', null);
                    set(self, 'ready', true);

                    console.log('# Service : Workplace : active :', false);
                    console.log('# Service : Workplace : READY');

                    self._isReady();

                    resolve(null);

                  } else {
                    businessObj.pending = false;
                    businessObj.business_id = key;
                    businessObj.created = snap.val().created;
                    businessObj.job_title = snap.val().job_title;
                    businessObj.manager = snap.val().manager;
                    set(self, 'data', businessObj);
                    set(self, 'active', true);
                    set(self, 'ready', true);

                    console.log('# Service : Workplace : active :', true);
                    console.log('# Service : Workplace : READY');

                    self._isReady();

                    resolve(businessObj);
                  }
                });
              }
            });
          });

        } else {
          set(self, 'data', null);
          set(self, 'active', false);
          set(self, 'ready', true);

          console.log('# Service : Workplace : active :', false);
          console.log('# Service : Workplace : READY');

          resolve(null);
        }
      });
    });
  },


  sendRequest(userId, businessId){
    //let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let businessRequests = firebaseApp.database().ref('businessRequests');
    let userWorkplaces = firebaseApp.database().ref('userWorkplaces');

    let businessData = {
      timestamp: Date.now(),
      sender_uid: userId
    };

    return new RSVP.Promise((resolve, reject) => {
      businessRequests.child(businessId).push(businessData).then((snap) => {
        let userData = {
          pending: true,
          request_id: snap.key
        };

        userWorkplaces.child(userId).child(businessId).set(userData).then(() => {
          resolve();
        });

      }).catch(err => {
        reject(err);
      });
    });
  },


  cancelRequest(){
    let self = this;
    let data = get(this, 'data');
    let firebaseApp = get(this, 'firebaseApp');
    let notifications = get(this, 'notifications');
    let uid = get(this, 'session.currentUser.uid');
    let userWorkplacesRef = firebaseApp.database().ref('userWorkplaces').child(uid).child(data.business_id);
    let businessRequestsRef = firebaseApp.database().ref('businessRequests').child(data.business_id).child(data.request_id);

    console.log(data);

    return new RSVP.Promise((resolve) => {
      businessRequestsRef.remove().then(() => {
        userWorkplacesRef.remove().then(() => {
          notifications.sendMessage(data.business_id, 'I canceled request!').then(() => {
            set(self, 'data', null);
            set(self, 'active', false);
            resolve();
          });
        });
      });
    });
  },


  cancelEmployement(){
    let self = this;
    let data = get(this, 'data');
    let notifications = get(this, 'notifications');
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session.currentUser.uid');
    let businessEmployeesRef = firebaseApp.database().ref('businessEmployees').child(data.business_id).child(uid);
    let businessCheckInsRef = firebaseApp.database().ref('businessCheckIns').child(data.business_id).child(uid);
    let userWorkplacesRef = firebaseApp.database().ref('userWorkplaces').child(uid).child(data.business_id);

    console.log(self.data);

    return new RSVP.Promise((resolve) => {
      businessEmployeesRef.remove().then(() => {
        userWorkplacesRef.remove().then(() => {
          businessCheckInsRef.remove().then(() => {
            notifications.sendMessage(data.business_id, 'I canceled employement!').then(() => {
              set(self, 'data', null);
              set(self, 'active', false);
              resolve();
            });
          });
        });
      });
    });
  },


  updateGrades(){
    let store = this.get('store');
    let uid = this.get('session.currentUser').uid;
    let firebaseApp = get(this, 'firebaseApp');

    return firebaseApp.database().ref('businessGrades').once('value', snap => {
      let business_uid = Object.keys(snap.val());
      console.log(business_uid);

      return RSVP.all(businesses.content.map(business => {
    });

    return store.query('businessGrade', {
      // path: 'publicGrade/'

    }).then(businesses => {

      return RSVP.all(businesses.content.map(business => {

        return store.query('userWorkplace', {
          path: 'userWorkplaces/' + business.id

        }).then((userWorkplaces) => {
          if (userWorkplaces.content.length) {
            let workplace_uid = userWorkplaces.content[0].id;

            return store.query('businessGrade', {
              path: 'businessGrades/'+ workplace_uid + '/' + owner.id
            });

          } else {
            return false;
          }

        }).then(businessGrades => {

          let one = 0;
          let two = 0;
          let three = 0;
          let four = 0;
          let five = 0;

          if (businessGrades) {
            businessGrades.forEach(grade => {
              // console.log(grade._internalModel._data.value);
              switch (grade._internalModel._data.value) {
                case 1:
                  one++;
                break;
                case 2:
                  two++;
                break;
                case 3:
                  three++;
                break;
                case 4:
                  four++;
                break;
                case 5:
                  five++;
                break;
              }
            });
          }

          let total_sum = (one * 1) + (two * 2) + (three * 3) + (four * 4) + (five * 5);
          let total_grades = one + two + three + four + five;
          let average = total_sum / total_grades;

          function roundToTwo(num) {
            return +(Math.round(num + "e+2") + "e-2");
          }

          if (average) {
            return {
              average: roundToTwo(average),
              total: total_grades,
              one: one,
              two: two,
              three: three,
              four: four,
              five: five
            };

          } else {
            return false;
          }


        }).then(stat => {
          if (stat) {
            return firebaseApp.database().ref('publicGradesStats').child(owner.id).set(stat);

          } else {
            return false;
          }
        });

      })).then((res) => {
        return res;
      });
    });
  }
});
