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
  workplace: service(),

  staff: null,
  management: null,

  ready: false,


  init(){
    this._super(...arguments);

    this.staff = [];
    this.management = [];
  },


  createList(){
    let self = this;
    let workplace = get(this, 'workplace');
    let uid = workplace.data ? workplace.data.business_id : get(this, 'session.currentUser').uid;

    let management = [];
    let staff = [];

    console.log('# Service : Employees : createList : business_uid :', uid);

    let firebaseApp = get(this, 'firebaseApp');
    let rootRef = firebaseApp.database().ref();
    let employeesRef = rootRef.child('businessEmployees').child(uid);

    return new RSVP.Promise(resolve => {
      employeesRef.once('value', snap => {
        console.log('SNAP: ', snap.val());

        if (!snap.val()) {
          set(self, 'management', []);
          set(self, 'staff', []);

          set(self, 'ready', true);

          resolve({
            staff: [],
            management: []
          });

        } else {

          let employee_uids = Object.keys(snap.val());
          let total_employees = employee_uids.length;
          let fully_loaded_count = 0;


          employee_uids.forEach((employee_uid) => {
            let userBusiness = snap.val()[employee_uid];

            let userProfileRef = rootRef.child('userProfiles').child(employee_uid);
            let gradesRef = rootRef.child('businessGrades').child(uid).child(employee_uid);

            userProfileRef.once('value', snap => {
              let profileVal = snap.val();
              profileVal.uid = employee_uid;

              gradesRef.once('value', _snap => {
                let gradeObj = self.getGradeObjects(_snap.val());
                let joinedObj = Object.assign(userBusiness, profileVal);

                joinedObj.grades = gradeObj;

                if (joinedObj.manager) {
                  management.addObject(joinedObj);
                } else {
                  staff.addObject(joinedObj);
                }

                fully_loaded_count++;

                if (fully_loaded_count === total_employees) {
                  set(self, 'management', management);
                  set(self, 'staff', staff);

                  set(self, 'ready', true);

                  resolve({
                    staff: staff,
                    management: management
                  });
                }
              });
            });
          });
        }
      });
    });
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
    obj.average = formated.average;
    obj.total = formated.total;

    return obj;
  },


  deleteEmployee(employee){
    let user_uid = employee.uid;
    let paperToaster = get(this, 'paperToaster');
    let firebaseApp = get(this, 'firebaseApp');
    let notifications = get(this, 'notifications');
    let business_uid = get(this, 'session.currentUser').uid;
    let rootRef = firebaseApp.database().ref();
    let employeesRef = rootRef.child('businessEmployees').child(business_uid).child(user_uid);
    let userWorkplacesRef = rootRef.child('userWorkplaces').child(user_uid).child(business_uid);

    return new RSVP.Promise((resolve) => {
      employeesRef.remove().then(() => {
        userWorkplacesRef.remove().then(() => {
          notifications.sendMessage(user_uid, 'Your profile is no longer linked to our business.').then(() => {
            let toasterText = 'You successfully removed the profile of ' + employee.first_name + ' ' + employee.last_name + '.';
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
