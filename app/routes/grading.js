import Ember from 'ember';
import RSVP from 'rsvp';
import moment from 'moment';

const {
  Route,
  inject: { service },
  get,
  $,
  run
} = Ember;


export default Route.extend({
  firebaseApp: service(),
  overlap_treshold: 2,

  model(){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session').get('uid');

    return self.getUserCheckIns(uid).then(myTodayCheckins => {
      return myTodayCheckins;

    }).then(myTodayCheckins => {
      //console.log('### GOT : myTodayCheckins');
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

        return {
          profiles: profiles,
          myTodayCheckins: myTodayCheckins
        };
      });

    }).then(data => {
      //console.log('### GOT : myTodayCheckins, profiles');
      //console.log(data);

      let privateGradesRef = firebaseApp.database().ref('privateGrades').child(uid);

      var date = new Date();
      date.setHours(0,0,0,0);
      // let start = date.getTime() - (3600000 * 24);
      let start = date.getTime();

      return privateGradesRef.orderByChild('timestamp').startAt(start).once('value').then(snapshot => {
        let snap = snapshot.val();

        let privateGrades = $.map(snap, function(grade) {
          return grade;
        });

        let historyProfiles = [];

        privateGrades.forEach(function(grade){
          // console.log(grade.value);
          data.profiles.forEach(function(profile){
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

        //console.log(historyProfiles);

        return {
          myTodayCheckins: data.myTodayCheckins,
          history: historyProfiles,
          privateGrades: privateGrades,
          profiles: data.profiles
        };
      });

    }).then(data => {
      //console.log('### GOT : myTodayCheckins, profiles, history, privateGrades');
      //console.log(data);

      // ----------------------------------------
      // CONSTRUCT GRADABLE USERS
      // ----------------------------------------

      return new RSVP.Promise((resolve, reject) => {
        let gradableUsers = [];
        let gradableUsersReady = false;
        let now = Date.now();

        // Q: Did we check in today?
        if (data.myTodayCheckins.length === 0) {
          // A: No we didn't check in today so resolve immediately
          // with empty myTodayCheckins and gradableUsers arrays
          // and do not continue with further checks
          resolve({
            myTodayCheckins: [],
            gradableUsers: [],
            history: data.history.reverse()
          });

          return;
        }

        console.log('# myTodayCheckins :', data.myTodayCheckins);
        console.log('# I checked in today : CONTINUE');

        data.profiles.forEach((profile, index) => {
          let graded = $.map(data.privateGrades, grade => {
            if (grade.uid === profile.id) {
              return profile.id;
            }
          });

          //console.log(graded);

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

                data.myTodayCheckins.forEach((myCheckIn, index) => {
                  console.log('------------------------------------');
                  console.log(index, profile.first_name,', checkins:',  checkins.length);
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
                console.log('already graded:', graded[gradedUserIndex]);
              }
            }

            if (index === data.profiles.length - 1) {
              gradableUsersReady = true;
            }
          });
        });

        function isGradableUsersReady(){
          if (gradableUsersReady) {
            console.log('### gradableUsersReady');
            resolve({
              myTodayCheckins: data.myTodayCheckins,
              gradableUsers: gradableUsers,
              history: data.history.reverse()
            });

          } else {
            setTimeout(function(){
              isGradableUsersReady();
            }, 100);
          }
        }

        isGradableUsersReady();
      });

    }).catch(error => {
      console.log(error);
    });
  },


  getUserCheckIns(uid){
    let firebaseApp = get(this, 'firebaseApp');
    let refcheckIns = firebaseApp.database().ref('checkIns').child(uid);
    let date = new Date();
    date.setHours(0,0,0,0);
    let start = date.getTime();

    return new RSVP.Promise((resolve, reject) => {
      refcheckIns.orderByChild('in').startAt(start).once('value').then(snapshot => {
        let snap = snapshot.val();
        let checkIns = $.map(snap, function(checkIn) {
          return checkIn;
        });
        resolve(checkIns);
      });
    });
  }
});
