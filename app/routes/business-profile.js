import Ember from 'ember';
import RSVP from 'rsvp';

const {
  inject: { service },
  get,
  Route
} = Ember;


export default Route.extend({
  //session: service(),
  user: service(),
  //firebaseApp: service(),

  model(){
    let user = get(this, 'user');
    // let firebaseApp = get(this, 'firebaseApp');
    // let user_uid = get(this, 'session').get('uid');
    // let businessProfileRef = firebaseApp.database().ref('businessProfiles').child(user_uid);
    //
    // return new RSVP.Promise((resolve, reject) => {
    //   businessProfileRef.once('value').then(snap => {
    //     let val = snap.val();
    //     console.log(val);
    //     resolve(val);
    //   });
    // });

    return user.get('businessProfile');
  }
});
