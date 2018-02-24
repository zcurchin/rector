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

  data: null,
  ready: false,
  active: false,


  initialize(){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let employees = get(this, 'employees');
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
        //return;
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
                set(self, 'data', businessObj);
                set(self, 'ready', true);

                console.log('# Service : Workplace : active :', false);
                console.log('# Service : Workplace : READY');

                resolve(businessObj);

              } else {
                businessEmployees.once('value', snap => {
                  //console.log('businessEmployees :', snap.val());

                  if (!snap.val()) {
                    set(self, 'data', null);
                    set(self, 'ready', true);

                    console.log('# Service : Workplace : active :', false);
                    console.log('# Service : Workplace : READY');

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

                    if (snap.val().manager) {
                      employees.initialize(key);
                    }

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
  }
});
