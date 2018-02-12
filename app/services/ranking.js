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
  workplace: service(),
  user: service(),

  ready: false,
  workplaceActive: false,
  showManagers: false,
  workers: [],
  managers: [],


  initialize(){
    let self = this;
    let uid = get(this, 'session').get('uid');
    let user = get(this, 'user');
    let session = get(this, 'session');
    let workplace = get(this, 'workplace');

    let firebaseApp = get(this, 'firebaseApp');
    let db = firebaseApp.database();
    let userProfiles = db.ref('userProfiles');
    let business_id = user.accountType.user ? workplace.data.business_id : uid;
    let businessEmployees = db.ref('businessEmployees').child(business_id);
    let businessGrades = db.ref('businessGrades').child(business_id);

    if (user.accountType.user && !workplace.active) {
      set(this, 'ready', true);
      return;

    } else {
      set(this, 'ready', true);
      set(this, 'workplaceActive', true);
    }

    let workers = [];
    let managers = [];

    console.log('------------------------------------');
    console.log('# Service : Ranking : initialize');
    console.log('------------------------------------');

    // console.log('ACCOUNT TYPE : USER :', user.accountType.user);

    console.log('business_id:', business_id);


    businessEmployees.once('value').then(snap => {
      let employees = snap.val();
      return employees;

    }).then(employees => {
      Object.keys(employees).forEach((uid, index) => {
        let employee_data = employees[uid];

        userProfiles.child(uid).once('value').then(snap => {
          let profile_data = snap.val();
          let user_data = Object.assign(employee_data, profile_data);

          return user_data;

        }).then(user_data => {

          businessGrades.child(uid).once('value').then(snap => {
            let user_grades_obj = snap.val();
            let user_grades_arr = [];

            Object.keys(user_grades_obj).forEach(grade => {
              user_grades_arr.push(user_grades_obj[grade].value);
            });

            user_data.grades = self.formatGrades(user_grades_arr);
            // console.log(user_data);
            if (user_data.manager) {
              managers.push(user_data);
            } else {
              workers.push(user_data);
            }

            if (Object.keys(employees).length === index + 1) {
              console.log('LAST EMPLOYEE');
              let sortedManagers = self.sortList(managers);
              let sortedWorkers = self.sortList(workers);

              set(self, 'managers', sortedManagers);
              set(self, 'workers', sortedWorkers);
              set(self, 'ready', true);
            }
          });
        });
      });
    });
  },


  sortList(list){
    list.sort(function(a, b) {
      //console.log(a, b);
      if (a.grades.average > b.grades.average) {
        return -1;
      } else if (a.grades.average < b.grades.average) {
        return 1;
      } else if (a.grades.average === b.grades.average) {
        return 0;
      }
    });

    return list;
  },


  roundToTwo(num){
    return +(Math.round(num + "e+2") + "e-2");
  },


  formatGrades(grades){
    let valid_grades = grades.filter(grade => {
      return grade > 0;
    }).map(grade => {
      return grade;
    });

    // console.log(valid_grades);

    let sum = 0;
    let total = 0;

    valid_grades.forEach(grade => {
      sum += grade;
      total++;
    });

    return {
      average: this.roundToTwo(sum / total),
      total: total
    };
  }
});
