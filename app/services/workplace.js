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
  notifications: service(),

  ready: false,
  data: null,

  setup(){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let employees = get(this, 'employees');
    let uid = get(this, 'session.currentUser.uid');
    let userWorkplaces = firebaseApp.database().ref('userWorkplaces').child(uid);

    console.log('# Service : Workplace : setup :', uid);

    userWorkplaces.on('value', snap => {
      console.log('# Service : Workplace : on value :', snap.val());

      let val = snap.val();

      if (val) {
        let keys = Object.keys(val);

        keys.forEach((key, index) => {
          let pending = val[key].pending;
          console.log('# Service : Workplace : pending :', val[key].pending);

          let businessEmployees = firebaseApp.database().ref('businessEmployees').child(key).child(uid);
          let businessProfiles = firebaseApp.database().ref('businessProfiles').child(key);

          businessProfiles.once('value', snap => {
            console.log('# Service : Workplace : businessProfile :', snap.val());

            let businessObj = snap.val();

            if (pending) {
              businessObj.pending = true;
              set(self, 'data', businessObj);
              set(self, 'ready', true);

            } else {
              businessEmployees.once('value', snap => {
                console.log('businessEmployees :', snap.val());

                businessObj.pending = false;
                businessObj.business_id = key;
                businessObj.created = snap.val().created;
                businessObj.job_title = snap.val().job_title;
                businessObj.manager = snap.val().manager;
                set(self, 'data', businessObj);
                set(self, 'ready', true);

                if (snap.val().manager) {
                  employees.setup(key);
                }
              });
            }
          });
        });

      } else {
        set(self, 'ready', true);
        set(self, 'data', null);
      }
    });
  },


  cancelEmployement(){
    let self = this;
    let data = get(this, 'data');
    let notifications = get(this, 'notifications');
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session.currentUser.uid');
    let businessEmployees = firebaseApp.database().ref('businessEmployees').child(data.business_id).child(uid);

    return new RSVP.Promise((resolve) => {
      businessEmployees.remove().then(() => {
        notifications.sendMessage(data.business_id, 'I canceled employement!').then(() => {
          set(self, 'data', null);
          resolve();
        });
      });
    });
  }
});
