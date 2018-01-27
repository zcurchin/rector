import Ember from 'ember';
import RSVP from 'rsvp';

const {
  inject: { service },
  get,
  set
} = Ember;


export default Ember.Service.extend({
  session: service(),
  workplace: service(),
  firebaseApp: service(),

  ready: false,
  workplaceExist: false,

  checkedIn: false,
  checkedInAt: null,
  autoCheckOutAt: null,
  currentCheckInId: null,
  checkedOutAt: null,

  history: [],


  initialize(){
    let self = this;
    let history = get(this, 'history');
    let workplace = get(this, 'workplace');

    console.log('# Service : Checking : initialize');
    console.log('# Service : Checking : workplace :', workplace.data);

    return new RSVP.Promise((resolve, reject) => {
      if (!workplace.data || (workplace.data && workplace.data.pending)) {
        set(self, 'ready', true);
        resolve();

      } else {
        set(self, 'workplaceExist', true);

        self.getCheckIns().then(data => {
          console.log(data);

          if (data) {
            let lastCheckIn = data[data.length - 1];

            if (lastCheckIn.out > Date.now()) {
              console.log('### CHECKED IN');
              set(self, 'checkedIn', true);
              set(self, 'currentCheckInId', lastCheckIn.id);
              set(self, 'checkedInAt', lastCheckIn.in);
              set(self, 'autoCheckOutAt', lastCheckIn.out);

              if (data.length > 1) {
                data.forEach((checkin, i) => {
                  if (data.length - 1 > i) {
                    history.pushObject(checkin);
                  }
                });
              }

            } else {
              console.log('### CHECKED OUT');
              set(self, 'checkedOutAt', lastCheckIn.out);
              set(self, 'history', data);
            }
          }

          set(self, 'ready', true);

          resolve();
        });
      }
    });
  },


  updateHistory: function(obj){
    let history = get(this, 'history');

    if (type === 'checkOut') {
      history.unshiftObject(obj);
    }
  },


  checkIn(checkOutMilis){
    let self = this;
    let user_uid = get(this, 'session.currentUser.uid');
    let workplace_uid = get(this, 'workplace').data.business_id;
    let firebaseApp = get(this, 'firebaseApp');
    let checkInsRef = firebaseApp.database().ref('businessCheckIns').child(workplace_uid).child(user_uid);

    let now = Date.now();

    let data = {
      in: now,
      out: checkOutMilis
    };

    return checkInsRef.push(data).then(() => {
      set(self, 'checkedIn', true);
      set(self, 'checkedInAt', data.in);
      set(self, 'autoCheckOutAt', data.out);
      set(self, 'currentCheckInId', data.in);
    });
  },


  checkOut(timestamp, type){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let user_uid = get(this, 'session.currentUser.uid');
    let workplace_uid = get(this, 'workplace').data.business_id;
    let history = get(this, 'history');
    let checkIn_id = get(this, 'currentCheckInId');
    let checkedInAt = get(this, 'checkedInAt');
    let checkInRef = firebaseApp.database().ref('businessCheckIns').child(workplace_uid).child(user_uid).child(checkIn_id);

    if (type !== 'update') {
      set(self, 'checkedIn', false);
    }

    let outTime = timestamp || Date.now();

    return checkInRef.update({
      out: outTime

    }).then(data => {
      if (type === 'update') {
        set(self, 'autoCheckOutAt', outTime);
      } else {
        set(self, 'checkedOutAt', outTime);
      }

      history.unshiftObject({
        in: checkedInAt,
        out: outTime
      });
    });
  },


  getCheckIns(){
    let workplace_uid = get(this, 'workplace').data.business_id;
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session.currentUser.uid');
    let userCheckins = firebaseApp.database().ref('businessCheckIns').child(workplace_uid).child(uid);

    return new RSVP.Promise((resolve, reject) => {
      userCheckins.orderByKey().limitToLast(10).once('value').then(snap => {
        let data = snap.val();

        if (data) {
          let history = Object.keys(data).map(item => {
            return {
              in: data[item].in,
              out: data[item].out,
              id: item
            };
          });

          resolve(history);

        } else {
          resolve(null);
        }

      }).catch(error => {
        reject(error);
      });
    });
  }
});
