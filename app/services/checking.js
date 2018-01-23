import Ember from 'ember';
import RSVP from 'rsvp';

const {
  inject: { service },
  get,
  set
} = Ember;


export default Ember.Service.extend({
  session: service(),
  firebaseApp: service(),

  ready: false,
  checkedIn: false,
  checkedInAt: null,
  autoCheckOutAt: null,
  currentCheckInId: null,
  checkedOutAt: null,

  history: [],


  initialize(){
    let self = this;
    let history = get(this, 'history');

    return new RSVP.Promise((resolve, reject) => {
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
      });
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
    let firebaseApp = get(this, 'firebaseApp');
    let checkIns = firebaseApp.database().ref('checkIns');
    let uid = get(this, 'session.currentUser.uid');

    let now = Date.now();

    let data = {
      in: now,
      out: checkOutMilis
    };

    return checkIns.child(uid).push(data).then(() => {
      set(self, 'checkedIn', true);
      set(self, 'checkedInAt', data.in);
      set(self, 'autoCheckOutAt', data.out);
    });
  },


  checkOut(timestamp, type){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let history = get(this, 'history');
    let uid = get(this, 'session.currentUser.uid');
    let checkIn_id = get(this, 'currentCheckInId');
    let checkedInAt = get(this, 'checkedInAt');
    let checkInRef = firebaseApp.database().ref('checkIns/'+uid+'/'+checkIn_id);

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
    let firebaseApp = get(this, 'firebaseApp');
    let uid = get(this, 'session.currentUser.uid');
    let checkIns = firebaseApp.database().ref('checkIns');
    let userCheckins = checkIns.child(uid);

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
