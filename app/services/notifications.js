import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Service,
  inject: { service },
  get,
  set
} = Ember;


export default Service.extend({
  session: service(),
  user: service(),
  firebaseApp: service(),

  total: 0,
  requests: [],
  messages: [],


  setup(){
    let self = this;
    let uid = get(this, 'session').get('uid');
    let firebaseApp = get(this, 'firebaseApp');
    let accountType = get(this, 'user').accountType;

    if (accountType.business) {
      firebaseApp.database().ref('businessRequests').child(uid).on('value', snap => {
        let val = snap.val();
        set(self, 'requests', []);

        if (val) {
          let total_reqs = Object.keys(val).length;
          console.log(total_reqs);

          if (total_reqs > 0) {
            set(self, 'total', total_reqs);
          }

          let reqs = Object.keys(val).map(req => {
            //console.log(val[req]);
            return {
              timestamp: val[req].timestamp,
              uid: val[req].from
            };
          });

          reqs.forEach((req, index) => {
            let sender_profile_uid = req.uid;

            firebaseApp.database().ref('userProfiles').child(sender_profile_uid).once('value', snap => {
              let profile = snap.val();
              //console.log(Object.keys(profile));

              Object.keys(profile).forEach(prof_key => {
                req[prof_key] = profile[prof_key];
              });

              if (index + 1 === total_reqs) {
                set(self, 'requests', reqs.reverse());
              }
            });
          });
        }
      });
    }
  },


  removeBusinessRequest(data){
    let firebaseApp = get(this, 'firebaseApp');
    console.log(data);

    firebaseApp.database().ref('businessRequests').child(data.uid).remove();
  }
});
