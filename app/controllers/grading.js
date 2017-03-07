import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get
} = Ember;


export default Controller.extend({
  firebaseApp: service(),

  actions: {
    gradeUser(uid, grade){
      console.log('# GRADE : ', uid, grade);

      let model = get(this, 'model');

      model.forEach((profile) => {
        if (profile.id === uid) {
          model.removeObject(profile);
        }
      });

      let myuid = get(this, 'session.currentUser.uid');
      let firebaseApp = get(this, 'firebaseApp');
      let publicGrades = firebaseApp.database().ref('publicGrades').child(uid);
      let privateGrades = firebaseApp.database().ref('privateGrades').child(myuid);

      // firebaseApp.database().ref('publicGrades').child(uid).once('value').then(snapshot => {
      //   var value = snapshot.val();
      //   console.log(value);
      // });

      let public_data = {
        timestamp: Date.now(),
        value: grade
      };

      publicGrades.push(public_data);

      let private_data = {
        timestamp: Date.now(),
        value: grade,
        uid: uid
      };

      privateGrades.push(private_data);
    }
  }
});
