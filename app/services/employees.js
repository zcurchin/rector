import Ember from 'ember';
//import RSVP from 'rsvp';

const {
  Service,
  inject: { service },
  get
} = Ember;


export default Service.extend({
  firebaseApp: service(),
  session: service(),

  staff: [],
  management: [],

  setup(business_id){
    let staff = get(this, 'staff');
    let management = get(this, 'management');

    let firebaseApp = get(this, 'firebaseApp');
    let uid = business_id || get(this, 'session.currentUser').uid;
    let rootRef = firebaseApp.database().ref();
    let employeesRef = rootRef.child('businessEmployees').child(uid);

    employeesRef.on('child_added', snap => {
      let userProfileRef = rootRef.child('userProfiles').child(snap.key);
      let employeeVal = snap.val();
      employeeVal.user_uid = snap.key;

      console.log('# Service : Employees : child_added : ', snap.key);

      userProfileRef.once('value', snap => {
        let profileVal = snap.val();
        let joinedObj = Object.assign(employeeVal, profileVal);

        if (joinedObj.manager) {
          management.addObject(joinedObj);
        } else {
          staff.addObject(joinedObj);
        }
      });
    });

    employeesRef.on('child_removed', snap => {
      console.log('# Service : Employees : child_removed : ', snap.key);

      let collection = snap.val().manager ? management : staff;

      collection.forEach(employeeObj => {
        if (employeeObj.user_uid === snap.key) {
          collection.removeObject(employeeObj);
        }
      });
    });
  },


  deleteEmployee(user_uid){
    let firebaseApp = get(this, 'firebaseApp');
    let business_uid = get(this, 'session.currentUser').uid;
    let rootRef = firebaseApp.database().ref();
    let employeesRef = rootRef.child('businessEmployees').child(business_uid);

    employeesRef.child(user_uid).remove();
  }
});