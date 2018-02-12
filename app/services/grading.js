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
  checking: service(),
  // overlap_treshold: 135, // minutes
  overlap_treshold: 1, // minutes
  after_midnight_treshold: 3, // hours
  yesterday: false,

  ready: false,
  gradableUsers: [],
  history: [],


  initialize(){
    let self = this;
    let workplace = get(this, 'workplace');

    console.log('------------------------------------');
    console.log('# Service : Grading : initialize');
    console.log('------------------------------------');

    if (workplace.active) {
      this.buildGradableList().then(data => {
        set(self, 'gradableUsers', data.gradableUsers);
        set(self, 'history', data.history);
        set(self, 'ready', true);

        self.setYesterday();

        //console.log('# Service : Grading : data :', data);
        console.log('# Service : Grading : READY');
      });

    } else {
      set(self, 'ready', true);
    }
  },


  refreshGrading(){
    let self = this;

    return this.buildGradableList().then(data => {
      set(self, 'gradableUsers', data.gradableUsers);
      set(self, 'history', data.history);

      self.setYesterday();
    });
  },


  buildGradableList(){
    let self = this;
    let uid = get(this, 'session').get('uid');
    let checking = get(this, 'checking');
    let workplace = get(this, 'workplace');

    // console.log(checking);

    console.log('- workplace : active :', workplace.active);
    console.log('- checking : checkedIn :', checking.checkedIn);

    // default model
    let model = {
      gradableUsers: [],
      history: []
    };

    // -----------------------------------------------
    // Step: 1
    // -----------------------------------------------
    console.log('### STEP : 1 : get my todays checkins');

    // return new RSVP.Promise(resolve => {
    //   console.log('checkedIn :', checking.checkedIn);
    //   resolve();
    // });

    console.log('### UID :', uid);

    return self.getUserCheckIns(uid).then(myTodayCheckins => {
      console.log('--- myTodayCheckins :', myTodayCheckins.length);

      if (myTodayCheckins.length === 0) {
        console.log('### STOP : no todays checkins');
        return model;

      } else {
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


  gradeUser(uid, grade, comment){
    console.log('### GRADE :', grade);
    console.log('### UID :', uid);
    console.log('### COMMENT :', comment ? true : false);

    let myuid = get(this, 'session.currentUser.uid');
    let business_id = get(this, 'workplace').data.business_id;
    let firebaseApp = get(this, 'firebaseApp');
    let db = firebaseApp.database();
    let publicGrades = db.ref('publicGrades').child(uid);
    let privateGrades = db.ref('privateGrades').child(myuid);
    let businessGrades = db.ref('businessGrades').child(business_id).child(uid);
    let now = Date.now();
    let gradableUsers = get(this, 'gradableUsers');
    let history = get(this, 'history');

    let public_data = {
      timestamp: now,
      value: grade
    };

    return publicGrades.push(public_data).then(() => {
      let private_data = {
        uid: uid,
        timestamp: now,
        value: grade
      };

      if (comment) { private_data.comment = comment; }

      return privateGrades.push(private_data);

    }).then(() => {
      if (comment) { public_data.comment = comment; }

      return businessGrades.push(public_data).then(() => {
        gradableUsers.forEach((profile) => {
          if (profile.id === uid) {
            gradableUsers.removeObject(profile);
            profile.grade_value = grade;
            profile.grade_timestamp = now;
            history.unshiftObject(profile);
          }
        });
      });
    });
  },


  setYesterday(){
    let date = new Date();
    let hours = date.getHours();
    let after_midnight_treshold = get(this, 'after_midnight_treshold');

    console.log('# Service : Grading : hours :', hours);
    console.log('# Service : Grading : after_midnight_treshold :', after_midnight_treshold);

    if (hours < after_midnight_treshold) {
      let startDate = this.getStartTime('date');
      set(this, 'yesterday', startDate);

    } else {
      set(this, 'yesterday', false);
    }
  },


  getCoworkers(){
    let firebaseApp = get(this, 'firebaseApp');
    let workplace = get(this, 'workplace');
    let uid = get(this, 'session').get('uid');
    let business_id = workplace.data.business_id;
    let businessEmployeesRef = firebaseApp.database().ref('businessEmployees').child(business_id);

    return new RSVP.Promise(resolve => {
      businessEmployeesRef.once('value').then(snapshot => {
        let snap = snapshot.val();
        let ids = Object.keys(snap).filter(id => {
          return uid !== id ? id : false;
        });
        let profiles = [];

        //console.log(Object.keys(snap).length, ids.length);

        ids.forEach(function(id, index){
          snap[id].id = id;

          //console.log(snap[id]);

          let employeeProfileRef = firebaseApp.database().ref('userProfiles').child(id);

          employeeProfileRef.once('value').then(snapshot => {
            let employeeProfile = snapshot.val();
            let joinedObj = Object.assign(employeeProfile, snap[id]);
            profiles.push(joinedObj);

            if (ids.length === index + 1) {
              //console.log('LLLLLLLLLLLLLLL:', objKeys);

              if (profiles.length === 0) {
                resolve(false);

              } else {
                resolve(profiles);
              }
            }
          });

        });
      });
    });
  },


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

    // console.log('# Service : Grading : getGradableUsers');
    // console.log(privateGrades, profiles, myTodayCheckins);

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
    let workplace = get(this, 'workplace');
    let firebaseApp = get(this, 'firebaseApp');
    let business_id = workplace.data.business_id;
    let refcheckIns = firebaseApp.database().ref('businessCheckIns').child(business_id).child(uid);
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
