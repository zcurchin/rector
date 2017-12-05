import Ember from 'ember';

const {
  Service,
  inject: { service },
  get,
  set
} = Ember;


export default Service.extend({
  firebaseApp: service(),
  session: service(),

  ready: false,
  list: [],


  setup(){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session.currentUser.uid');
    let userWorkplaces = firebaseApp.database().ref('userWorkplaces').child(uid);

    console.log('# Service : Workplace : setup :', uid);

    userWorkplaces.on('value', snap => {
      console.log('######### VALUE :', snap.val());

      let val = snap.val();

      if (val) {
        let keys = Object.keys(val);

        keys.forEach((key, index) => {
          let pending = val[key].pending;
          console.log(val[key].pending);

          let businessEmployees = firebaseApp.database().ref('businessEmployees').child(uid);
          let businessProfiles = firebaseApp.database().ref('businessProfiles').child(key);

          businessProfiles.once('value', snap => {
            console.log('businessProfile :', snap.val());

            let businessObj = snap.val();

            if (pending) {
              businessObj.pending = true;
              self.list.pushObject(businessObj);
              set(self, 'ready', true);

            } else {
              businessEmployees.once('value', snap => {
                console.log('businessProfiles :', snap.val());
              });
            }
          });
        });

      } else {
        set(self, 'ready', true);
        set(self, 'list', []);
      }
    });
  }
});
