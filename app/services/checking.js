import Ember from 'ember';
import RSVP from 'rsvp';
import moment from 'moment';

const {
  Service,
  inject: { service },
  get,
  set
} = Ember;


export default Service.extend({
  session: service(),
  workplace: service(),
  firebaseApp: service(),

  ready: false,
  checkedIn: false,
  checkedInToday: false,
  checkedInAt: null,
  autoCheckOutAt: null,
  currentCheckInId: null,
  checkedOutAt: null,

  after_midnight_treshold: 3,

  history: [],


  initialize(){
    let self = this;
    let history = get(this, 'history');
    let workplace = get(this, 'workplace');

    console.log('------------------------------------');
    console.log('# Service : Checking : initialize');
    console.log('------------------------------------');

    return new RSVP.Promise((resolve) => {
      if (!workplace.active) {
        set(self, 'ready', true);
        console.log('# Service : Checking : NO WORKPLACE');
        console.log('# Service : Checking : READY');
        resolve();

      } else {

        self.getCheckIns().then(data => {
          //console.log(data);

          if (data) {
            let lastCheckIn = data[data.length - 1];

            let after_midnight_treshold = get(this, 'after_midnight_treshold');
            let startToday = moment().startOf('day').add(after_midnight_treshold, 'hours').format('x');

            if (lastCheckIn > startToday) {
              set(self, 'checkedInToday', true);
            }

            if (lastCheckIn.out > Date.now()) {
              set(self, 'checkedIn', true);
              set(self, 'currentCheckInId', lastCheckIn.id);
              set(self, 'checkedInAt', lastCheckIn.in);
              set(self, 'autoCheckOutAt', lastCheckIn.out);

              console.log('# Service : Checking : checkedIn :', true);

              if (data.length > 1) {
                data.forEach((checkin, i) => {
                  if (data.length - 1 > i) {
                    history.pushObject(checkin);
                  }
                });
              }

            } else {
              set(self, 'checkedIn', false);
              set(self, 'checkedOutAt', lastCheckIn.out);
              set(self, 'history', data);

              console.log('# Service : Checking : checkedIn :', false);
            }
          }

          console.log('# Service : Checking : READY');
          set(self, 'ready', true);

          resolve();
        });
      }
    });
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

    return checkInsRef.push(data).then((snap) => {
      console.log(snap.key);
      set(self, 'checkedIn', true);
      set(self, 'checkedInAt', data.in);
      set(self, 'autoCheckOutAt', data.out);
      set(self, 'currentCheckInId', snap.key);
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

    console.log('-----------------------------');
    console.log('timestamp:', timestamp);
    console.log('type:', type);
    console.log('checkIn_id:', checkIn_id);
    console.log('workplace_uid:', workplace_uid);
    console.log('user_uid:', user_uid);
    console.log('-----------------------------');

    if (type !== 'update') {
      set(self, 'checkedIn', false);
    }

    let outTime = timestamp || Date.now();

    return checkInRef.update({
      out: outTime

    }).then(() => {
      if (type === 'update') {
        set(self, 'autoCheckOutAt', outTime);

      } else {
        set(self, 'checkedOutAt', outTime);
        history.unshiftObject({
          in: checkedInAt,
          out: outTime
        });
      }
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
