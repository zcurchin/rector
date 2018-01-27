import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  firebaseApp: service(),
  user: service(),

  model(){
    let user = get(this, 'user');
    let firebaseApp = get(this, 'firebaseApp');
    let userProfiles = firebaseApp.database().ref('userProfiles');
    let publicGrades = firebaseApp.database().ref('publicGrades');

    let model = [];

    console.log('ACCOUNT TYPE : USER :', user.accountType.user);

    return new RSVP.Promise((resolve, reject) => {
      userProfiles.once('value').then(profiles => {
        let value = profiles.val();

        console.log('oooooooooooooooooo');
        console.log(value);

        if (value === null) {
          resolve([]);
          return;
        }

        let totalProfiles = Object.keys(value).length;

        Object.keys(value).forEach((key, index) => {
          let profileObj = value[key];

          let modelObj = {
            uid: key,
            profileName: profileObj.first_name + ' ' + profileObj.last_name,
            profileImage: profileObj.profile_image,
            grade_average: null,
            grade_total: null
          };

          publicGrades.child(key).once('value').then((data) => {
            let grades = data.val();

            if (grades) {
              let totalGrades = Object.keys(grades).length;
              let sum = 0;
              let all = 0;

              Object.keys(grades).forEach((key, index) => {
                //console.log(grades[key]);
                let gradeVal = grades[key].value;

                if (gradeVal !== 0) {
                  sum = sum + gradeVal;
                  all++;
                }

                if (totalGrades === index + 1) {
                  console.log('LAST GRADE');
                  console.log(sum / all);

                  if (!isNaN(sum / all)) {
                    modelObj.grade_average = +(Math.round((sum / all) + "e+2")  + "e-2");
                    modelObj.grade_total = all;

                    model.push(modelObj);
                  }
                }
              });
            }

            if (totalProfiles === index + 1) {
              console.log('last profile loaded');

              model.sort(function(a, b) {
                //console.log(a, b);
                if (a.grade_average > b.grade_average) {
                  return -1;
                } else if (a.grade_average < b.grade_average) {
                  return 1;
                } else if (a.grade_average === b.grade_average) {
                  return 0;
                }
              });

              //console.log(model);

              resolve(model);
            }
          });
        });

      }).catch(err => {
        reject(err);
      });
    });
  },


  actions: {
    refreshRealtimeList(){
      console.log('refreshRealtimeList');
    }
  }
});
