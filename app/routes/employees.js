import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  firebaseApp: service(),
  user: service()


  // model(){
  //   let firebaseApp = get(this, 'firebaseApp');
  //   let user = get(this, 'user').accountType;
  //   console.log('MODEL: user.accountType', user);
  // }
});
