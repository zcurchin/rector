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
  notifications: service(),
  paperToaster: service(),

  ready: false,
  staff: null,
  management: null,


  init(){
    this._super(...arguments);

    this.staff = [];
    this.management = [];
  },


  initialize(business_id){
    console.log('# Service : Employees : initialize');
    let self = this;
    let staff = get(this, 'staff');
    let management = get(this, 'management');

    let firebaseApp = get(this, 'firebaseApp');
    let uid = business_id || get(this, 'session.currentUser').uid;
    let rootRef = firebaseApp.database().ref();
    let employeesRef = rootRef.child('businessEmployees').child(uid);

    // TO DO:
    // fix duplicated items after delete

    employeesRef.on('child_added', snap => {
      console.log(snap);

      let userProfileRef = rootRef.child('userProfiles').child(snap.key);
      let gradesRef = rootRef.child('businessGrades').child(uid).child(snap.key);
      let employeeVal = snap.val();
      employeeVal.user_uid = snap.key;

      console.log('# Service : Employees : child_added : ', snap.key);

      userProfileRef.once('value', snap => {
        let profileVal = snap.val();

        gradesRef.once('value', snap => {
          let gradeObj = self.getGradeObjects(snap.val());
          let joinedObj = Object.assign(employeeVal, profileVal, gradeObj);

          if (joinedObj.manager) {
            management.addObject(joinedObj);
          } else {
            staff.addObject(joinedObj);
          }
        });
      });
    });

    employeesRef.on('child_removed', snap => {
      //console.log('# Service : Employees : child_removed : ', snap.key);

      let collection = snap.val().manager ? management : staff;

      collection.forEach(employeeObj => {
        if (employeeObj.user_uid === snap.key) {
          collection.removeObject(employeeObj);
        }
      });
    });

    set(self, 'ready', true);

    console.log('# Service : Employees : READY');
  },


  roundToTwo(num){
    return +(Math.round(num + "e+2") + "e-2");
  },


  formatGrades(grades){
    let valid_grades = grades.filter(grade => {
      return grade.value > 0;
    }).map(grade => {
      return grade;
    });

    let sum = 0;
    let total = 0;

    valid_grades.forEach(grade => {
      sum += grade.value;
      total++;
    });

    return {
      average: this.roundToTwo(sum / total),
      total: total
    };
  },


  getGradeObjects(grades){
    let obj = {
      average_grade: null,
      total_grades: 0,
      all_grades: [],
      comments: []
    };

    if (!grades) { return {}; }

    Object.keys(grades).forEach(key => {
      obj.all_grades.push(grades[key]);

      if (grades[key].comment) {
        obj.comments.push(grades[key]);
      }
    });

    obj.comments.sort(function(a, b) {
      return a.timestamp - b.timestamp;
    });

    let formated = this.formatGrades(obj.all_grades);
    obj.average_grade = formated.average;
    obj.total_grades = formated.total;

    return obj;
  },


  deleteEmployee(employee){
    // console.log(employee);
    let user_uid = employee.user_uid;
    let paperToaster = get(this, 'paperToaster');
    let firebaseApp = get(this, 'firebaseApp');
    let notifications = get(this, 'notifications');
    let business_uid = get(this, 'session.currentUser').uid;
    let rootRef = firebaseApp.database().ref();
    let employeesRef = rootRef.child('businessEmployees').child(business_uid).child(user_uid);
    let userWorkplacesRef = rootRef.child('userWorkplaces').child(user_uid).child(business_uid);

    return new RSVP.Promise((resolve) => {
      window.history.back();

      employeesRef.remove().then(() => {
        userWorkplacesRef.remove().then(() => {
          notifications.sendMessage(user_uid, 'We canceled your employement!').then(() => {
            let toasterText = 'You deleted ' + employee.first_name + ' ' + employee.last_name + ' from your business';
            paperToaster.show(toasterText, {
              duration: 7000,
              position: 'top right'
            });
            resolve();
          });
        });
      });
    });
  }
});
