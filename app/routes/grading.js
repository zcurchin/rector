import Ember from 'ember';
import RSVP from 'rsvp';
import moment from 'moment';

const {
  Route,
  inject: { service },
  get,
  $
} = Ember;


export default Route.extend({
  firebaseApp: service(),
  // overlap_treshold: 135, // minutes
  overlap_treshold: 1, // minutes
  after_midnight_treshold: 3, // hours

  model(){
    console.log('=====================================');

    let self = this;
    // let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session').get('uid');

    // default model
    let model = {
      checkedInToday: false,
      gradableUsers: [],
      history: []
    };

    // -----------------------------------------------
    // Step: 1
    // -----------------------------------------------
    console.log('### STEP : 1 : get my todays checkins');
    return self.getUserCheckIns(uid).then(myTodayCheckins => {
      console.log('--- myTodayCheckins :', myTodayCheckins.length);

      if (myTodayCheckins.length === 0) {
        console.log('### STOP : no todays checkins');
        return model;

      } else {
        model.checkedInToday = true;

        // -------------------------------------------
        // Step: 2
        // -------------------------------------------
        console.log('### STEP : 2 : get coworkers');
        return self.getCoworkers().then(coworkers => {
          console.log('--- coworkers :', coworkers);

          if (!coworkers) {
            console.log('### STOP : No coworkers');
            return model;

          } else {
            // ---------------------------------------
            // Step: 3
            // ---------------------------------------
            console.log('### STEP : 3 : get history');
            return self.getHistory(coworkers).then(history => {
              console.log('--- history :', history.raw.length);

              if (history.profiles.length) { model.history = history.profiles; }

              // ---------------------------------------
              // Step: 4
              // ---------------------------------------
              console.log('### STEP : 4  : get gradable users');
              return self.getGradableUsers(history.raw, coworkers, myTodayCheckins).then(gradableUsers => {
                console.log('--- gradableUsers :', gradableUsers.length);
                if (gradableUsers.length) { model.gradableUsers = gradableUsers; }

                return model;
              });
            });
          }
        });
      }
    });
  },


  deactivate(){
    this._super(...arguments);

    this.controller.set('yesterdayInfo', false);
  },


  setupController(controller, model){
    this._super(controller, model);

    let date = new Date();
    let hours = date.getHours();
    let after_midnight_treshold = get(this, 'after_midnight_treshold');

    console.log('# Route : Grading : hours :', hours);
    console.log('# Route : Grading : after_midnight_treshold :', after_midnight_treshold);

    if (hours < after_midnight_treshold) {
      let startDate = this.getStartTime('date');
      controller.set('yesterday', startDate);

    } else {
      controller.set('yesterday', false);
    }
  },


  getCoworkers(){
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session').get('uid');

    return firebaseApp.database().ref('userProfiles').once('value').then(snapshot => {
      let snap = snapshot.val();
      let objKeys = Object.keys(snap);
      let profiles = [];

      objKeys.forEach(function(key){
        if (uid !== key) {
          snap[key].id = key;
          profiles.push(snap[key]);
        }
      });

      if (profiles.length === 0) {
        return false;

      } else {
        return profiles;
      }
    });
  },


  // getCheckedInCoworkers(){
  //   return this.getCoworkers().then(coworkers => {
  //     return coworkers;
  //
  //   }).then(coworkers => {
  //     return
  //   });
  // },


  getStartTime(type){
    let date = new Date();
    let hours = date.getHours();
    // let dateNum = date.getDate();
    let after_midnight_treshold = get(this, 'after_midnight_treshold');

    if (hours < after_midnight_treshold) {
      date.setDate(date.getDate() - 1);
    }

    date.setHours(0,0,0,0);

    if (!type) {
      return date.getTime();

    } else if (type === 'date') {
      let dateFormated = moment(date).format('dddd, MMM Do');
      return dateFormated;
    }
  },


  getHistory(profiles){
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session').get('uid');
    let privateGradesRef = firebaseApp.database().ref('privateGrades').child(uid);
    let start = this.getStartTime();

    return privateGradesRef.orderByChild('timestamp').startAt(start).once('value').then(snapshot => {
      let snap = snapshot.val();

      let privateGrades = $.map(snap, function(grade) {
        return grade;
      });

      let historyProfiles = [];

      privateGrades.forEach(function(grade){
        profiles.forEach(function(profile){
          if (grade.uid === profile.id) {
            let obj = {
              first_name: profile.first_name,
              last_name: profile.last_name,
              profile_image: profile.profile_image,
              grade_timestamp: grade.timestamp,
              grade_value: grade.value
            };

            historyProfiles.push(obj);
          }
        });
      });

      return {
        profiles: historyProfiles,
        raw: privateGrades
      };
    });
  },


  getGradableUsers(privateGrades, profiles, myTodayCheckins){
    let self = this;

    return new RSVP.Promise((resolve) => {
      let gradableUsers = [];
      let gradableUsersReady = false;
      let now = Date.now();

      profiles.forEach((profile, index) => {
        let graded = $.map(privateGrades, grade => {
          if (grade.uid === profile.id) {
            return profile.id;
          }
        });

        // console.log(graded);

        let gradedUserIndex = graded.indexOf(profile.id);

        // get checkins from profile
        self.getUserCheckIns(profile.id).then(checkins => {
          // check if user is checked in today
          if (checkins.length) {
            //console.log(checkins);

            // check if we already graded this user
            // if gradedUserIndex is not -1 we already graded user
            // checkins.forEach(otherCheckIn => {
            //   console.log(profile.first_name, moment(otherCheckIn.in).format('hh:mm:ss'));
            // });
            if (gradedUserIndex === -1){
              let overlaps = 0;

              myTodayCheckins.forEach((myCheckIn, index) => {
                console.log('------------------------------------');
                console.log(index, profile.first_name +' '+ profile.last_name,', checkins:',  checkins.length);
                console.log('------------------------------------');

                checkins.forEach(otherCheckIn => {

                  let A = myCheckIn.in;
                  let B = myCheckIn.out < now ? myCheckIn.out : now;
                  //let B = myCheckIn.out;
                  let C = otherCheckIn.in;
                  let D = otherCheckIn.out < now ? otherCheckIn.out : now;
                  //let D = otherCheckIn.out;

                  console.log('MY : in  :', moment(A).format('ddd, hh:mm:ss a'), '|| out :', moment(B).format('ddd, hh:mm:ss a'));
                  console.log('-- : in  :', moment(C).format('ddd, hh:mm:ss a'), '|| out :', moment(D).format('ddd, hh:mm:ss a'));

                  //http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap/325964#325964

                  if (!(B <= C || A >= D)) {
                    let overlaptime = Math.min(...[B-A, B-C, D-C, D-A]);
                    let ovelap_minutes = overlaptime / 1000 / 60;
                    overlaps = overlaps + ovelap_minutes;
                    console.log('OVERLAP: ', ovelap_minutes);
                    if (overlaps >= get(self, 'overlap_treshold')) {

                      // check if already in pushed
                      let already_pushed = false;

                      gradableUsers.forEach(function(user){
                        if (user.id === profile.id) {
                          already_pushed = true;
                        }
                      });

                      if (!already_pushed) {
                        gradableUsers.push(profile);
                      }
                    }
                  }
                });
              });

            } else {
              // already graded
              console.log('--- already graded:', graded[gradedUserIndex]);
            }
          }

          if (index === profiles.length - 1) {
            gradableUsersReady = true;
          }
        });
      });

      function isGradableUsersReady(){
        if (gradableUsersReady) {
          console.log('--- gradableUsersReady');
          resolve(gradableUsers);

        } else {
          setTimeout(function(){
            isGradableUsersReady();
          }, 100);
        }
      }

      isGradableUsersReady();
    });
  },


  getUserCheckIns(uid){
    let firebaseApp = get(this, 'firebaseApp');
    let refcheckIns = firebaseApp.database().ref('checkIns').child(uid);
    let start = this.getStartTime();

    return new RSVP.Promise((resolve, reject) => {
      refcheckIns.orderByChild('in').startAt(start).once('value').then(snapshot => {
        let snap = snapshot.val();
        let checkIns = $.map(snap, function(checkIn) {
          return checkIn;
        });
        resolve(checkIns);

      }).catch(error => {
        reject();
        console.log(error);
      });
    });
  }
});
