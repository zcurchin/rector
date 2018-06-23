import Ember from 'ember';
import RSVP from 'rsvp';
import moment from 'moment';

const {
  Service,
  inject: { service },
  observer,
  get,
  set
} = Ember;


export default Service.extend({
  firebaseApp: service(),
  session: service(),
  workplace: service(),
  user: service(),

  after_midnight_treshold: 3, // hours

  ready: false,
  workplaceActive: false,

  period: 'this_week',

  onPeriodChange: observer('period', function(){
    let period = get(this, 'period');
    this.createList(period);
  }),

  workers: [],
  managers: [],


  initialize(){
    this.createList();
  },


  resetList(){
    set(this, 'period', 'this_week');
    set(this, 'workers', []);
    set(this, 'managers', []);
  },


  createList(){
    let self = this;
    let period = get(this, 'period');
    let uid = get(this, 'session').get('uid');
    let user = get(this, 'user');
    // let sortByDefault = get(this, 'sortBy') === 'default' ? true : false ;
    let workplace = get(this, 'workplace');

    if (user.accountType.user && !workplace.active) {
      set(this, 'ready', true);
      return;

    } else {
      set(this, 'workplaceActive', true);
    }

    let firebaseApp = get(this, 'firebaseApp');
    let db = firebaseApp.database();
    let userProfiles = db.ref('userProfiles');
    let business_id = user.accountType.user ? workplace.data.business_id : uid;
    let businessEmployees = db.ref('businessEmployees').child(business_id);
    let businessGrades = db.ref('businessGrades').child(business_id);
    let workers = [];
    let managers = [];

    console.log('------------------------------------');
    console.log('# Service : Ranking : createList : ', period);
    console.log('------------------------------------');

    // console.log('ACCOUNT TYPE : USER :', user.accountType.user);

    console.log('business_id:', business_id);

    return new RSVP.Promise((resolve) => {
      businessEmployees.once('value').then(snap => {
        let employees = snap.val();
        return employees;

      }).then(employees => {
        if (!employees) {
          set(self, 'ready', true);
          return;
        }

        Object.keys(employees).forEach((uid, index) => {
          let employee_data = employees[uid];

          userProfiles.child(uid).once('value').then(snap => {
            let profile_data = snap.val();
            let user_data = Object.assign(employee_data, profile_data);

            return user_data;

          }).then(user_data => {
            let period = get(self, 'period');
            let periodObj = self.getPeriod(period);

            // console.log(periodObj);

            businessGrades.child(uid).orderByChild('timestamp').startAt(periodObj.start).endAt(periodObj.end).once('value').then(snap => {
              let user_grades_obj = snap.val();
              let user_grades_arr = [];

              // console.log('======================');
              // console.log(user_grades_obj);
              // console.log('======================');

              if (user_grades_obj) {
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
              }

              if (Object.keys(employees).length === index + 1) {
                console.log('LAST EMPLOYEE');
                let sortedManagers = self.sortList(managers);
                let sortedWorkers = self.sortList(workers);

                set(self, 'managers', sortedManagers);
                set(self, 'workers', sortedWorkers);
                set(self, 'ready', true);

                resolve();
              }
            });
          });
        });
      });
    });
  },


  getPeriod(period){
    let after_midnight_treshold = get(this, 'after_midnight_treshold');

    let startTime = null;
    let endTime = null;

    switch (period) {
      case 'yesterday':
        startTime = moment().startOf('day').subtract(1, 'day').add(after_midnight_treshold, 'hours').format('x');
        endTime = moment().startOf('day').add(after_midnight_treshold, 'hours').format('x');
      break;

      case 'this_week':
        startTime = moment().startOf('isoWeek').add(after_midnight_treshold, 'hours').format('x');
        endTime = moment().endOf('isoWeek').add(after_midnight_treshold, 'hours').format('x');
      break;

      case 'last_week':
        startTime = moment().startOf('isoWeek').subtract(7, 'days').add(after_midnight_treshold, 'hours').format('x');
        endTime = moment().endOf('isoWeek').subtract(7, 'days').add(after_midnight_treshold, 'hours').format('x');
      break;

      case 'this_month':
        startTime = moment().startOf('month').add(after_midnight_treshold, 'hours').format('x');
        endTime = moment().endOf('month').add(after_midnight_treshold, 'hours').format('x');
      break;

      case 'last_month':
        startTime = moment().startOf('month').subtract(1, 'month').add(after_midnight_treshold, 'hours').format('x');
        endTime = moment().endOf('month').subtract(1, 'month').add(after_midnight_treshold, 'hours').format('x');
      break;
    }

    return {
      start: parseInt(startTime),
      end: parseInt(endTime)
    };
  },


  sortList(list){
    console.log(list);
    if (list.length) {
      let sorted_1 = list.sort(function(a, b) {
        //console.log(a, b);
        if (a.grades.average > b.grades.average) {
          return -1;

        } else if (a.grades.average < b.grades.average) {
          return 1;

        } else if (a.grades.average === b.grades.average) {
          if (a.grades.total > b.grades.total) {
            return -1;

          } else if (a.grades.total < b.grades.total) {
            return 1;

          } else {
            return 0;
          }
        }
      });

      if (list.length > 5) {
        let first_50_percent = Math.floor(list.length / 2);
        return sorted_1.slice(0, first_50_percent);

      } else {
        return sorted_1;
      }

    } else {
      return [];
    }
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
