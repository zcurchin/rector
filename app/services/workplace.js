import Ember from 'ember';

const {
  Service,
  inject: { service },
  get
} = Ember;


export default Service.extend({
  firebaseApp: service(),
  session: service(),

  ready: false,
  list: [],


  setup(){
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session.currentUser.uid');
    let userWorkplaces = firebaseApp.database().ref('userWorkplaces');

    console.log('# Service : Workplace : setup :', uid);

    userWorkplaces.on('value', snap => {
      console.log('######### VALUE :', snap.val());
    });
  }
});
