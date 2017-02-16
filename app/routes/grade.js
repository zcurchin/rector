import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  firebaseApp: service(),

  model(){
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session').get('uid');

    return firebaseApp.database().ref('userProfiles').once('value').then(snap => {
      let profiles_obj = snap.val();
      let profile_keys = Object.keys(profiles_obj);
      let profiles_arr = [];

      profile_keys.forEach(key => {
        if (uid !== key) {
          profiles_arr.push(profiles_obj[key]);
        }
      });

      console.log(profiles_arr);

      return profiles_arr;
    });
  },

  actions: {
    grade(){

    }
  }
});
