import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get
} = Ember;


export default Controller.extend({
  firebaseApp: service(),
  grading: service(),
  checking: service(),
  //session: service(),
  preloader: false,
  yesterday: false,
  yesterdayInfo: false,

  actions: {
    gradeUser(uid, grade){
      let myuid = get(this, 'session.currentUser.uid');
      let firebaseApp = get(this, 'firebaseApp');
      let publicGrades = firebaseApp.database().ref('publicGrades').child(uid);
      let privateGrades = firebaseApp.database().ref('privateGrades').child(myuid);
      let now = Date.now();
      let gradableUsers = get(this, 'model').gradableUsers;
      let history = get(this, 'model').history;

      console.log('# GRADE : ', uid, grade, myuid);

      gradableUsers.forEach((profile) => {
        if (profile.id === uid) {
          gradableUsers.removeObject(profile);
          profile.grade_value = grade;
          profile.grade_timestamp = now;
          history.unshiftObject(profile);
        }
      });

      let public_data = {
        timestamp: now,
        value: grade
      };

      publicGrades.push(public_data);

      let private_data = {
        timestamp: now,
        value: grade,
        uid: uid
      };

      privateGrades.push(private_data);
    },


    toggleYesterdayInfo(){
      this.toggleProperty('yesterdayInfo');
    }
  }
});
