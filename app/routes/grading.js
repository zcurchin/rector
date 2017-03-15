import Ember from 'ember';
//import RSVP from 'rsvp';

const {
  Route,
  inject: { service },
  get,
  $
} = Ember;


export default Route.extend({
  firebaseApp: service(),

  model(){
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session').get('uid');

    // return new RSVP.Promise((resolve, reject) => {
    //
    // });

    return firebaseApp.database().ref('userProfiles').once('value').then(snap => {
      let profiles_obj = snap.val();
      let profile_keys = Object.keys(profiles_obj);
      let profiles_arr = [];

      profile_keys.forEach(key => {
        if (uid !== key) {
          profiles_obj[key].id = key;
          profiles_arr.push(profiles_obj[key]);
        }
      });

      return profiles_arr;

    }).then(profiles_arr => {
      return firebaseApp.database().ref('privateGrades').child(uid).once('value').then(snapshot => {
        let snap = snapshot.val();
        let privateGrades = $.map(snap, function(grade) {
          return grade.uid;
        });

        let gradableUsers = $.map(profiles_arr, profile => {
          if (privateGrades.indexOf(profile.id) === -1) {
            return profile;
          }
        });

        return gradableUsers;
      });
    });
  },

  actions: {
    grade(){

    }
  }
});
