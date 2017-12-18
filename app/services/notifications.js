import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Service,
  inject: { service },
  observer,
  get,
  set
} = Ember;


export default Service.extend({
  session: service(),
  user: service(),
  firebaseApp: service(),

  ready: false,

  total: 0,

  requests: [],
  messages: [],


  onMessagesChanged: observer('messages', 'requests', function(){
    let requests = get(this, 'requests');
    let messages = get(this, 'messages');

    console.log('######### TOTAL CHANGED');
    console.log(messages.length, requests.length);

    set(this, 'total', messages.length + requests.length);

  }),


  setup(){
    let self = this;
    let accountType = get(this, 'user').accountType;

    console.log('# Service : Notifications : setup');

    let promises;

    if (accountType.business) {
      promises = {
        messages: self.handleMessages(),
        requests: self.handleRequests()
      };

    } else {
      promises = {
        messages: self.handleMessages()
      };
    }

    RSVP.hash(promises).then(data => {
      console.log(data);
      set(self, 'ready', true);
    });
  },


  handleRequests(){
    let self = this;
    let uid = get(this, 'session').get('uid');
    let firebaseApp = get(this, 'firebaseApp');
    let businessRequestsRef = firebaseApp.database().ref('businessRequests');

    console.log('# Service : Notifications : handleRequests');

    return new RSVP.Promise((resolve, reject) => {
      businessRequestsRef.child(uid).on('value', snap => {
        let val = snap.val();

        console.log('##### REQUESTS CHANGED :', val);

        if (val) {
          let total_reqs = Object.keys(val).length;

          let reqs = Object.keys(val).map((req, index) => {
            //console.log(val[req]);
            return {
              request_id: Object.keys(val)[index],
              timestamp: val[req].timestamp,
              sender_uid: val[req].sender_uid
            };
          });

          reqs.forEach((req, index) => {
            let sender_profile_uid = req.sender_uid;

            firebaseApp.database().ref('userProfiles').child(sender_profile_uid).once('value', snap => {
              let profile = snap.val();
              //console.log(Object.keys(profile));

              Object.keys(profile).forEach(prof_key => {
                req[prof_key] = profile[prof_key];
              });

              req.name = profile.first_name + ' ' + profile.last_name;

              if (index + 1 === total_reqs) {
                reqs.reverse();
                set(self, 'requests', reqs);
                resolve(reqs);
              }
            });
          });

        } else {
          set(self, 'requests', []);
          resolve([]);
        }
      });
    });
  },


  handleMessages(){
    let self = this;
    let uid = get(this, 'session').get('uid');
    // let user = get(this, 'user');
    let firebaseApp = get(this, 'firebaseApp');
    let messagesRef = firebaseApp.database().ref('messages');

    console.log('# Service : Notifications : handleMessages');

    return new RSVP.Promise((resolve, reject) => {
      messagesRef.child(uid).on('value', snap => {
        let val = snap.val();

        if (val) {
          let total_msgs = Object.keys(val).length;

          let msgs = Object.keys(val).map((msg, index) => {
            //console.log(val[req]);
            return {
              message_id: Object.keys(val)[index],
              business: val[msg].business,
              timestamp: val[msg].timestamp,
              sender_uid: val[msg].sender_uid,
              title: val[msg].title,
              text: val[msg].text
            };
          });

          console.log('# Service : Notifications : msgs :', msgs);

          msgs.forEach((msg, index) => {
            let dbRef = msg.business ? 'businessProfiles' : 'userProfiles';

            firebaseApp.database().ref(dbRef).child(msg.sender_uid).once('value', snap => {
              let profile = snap.val();
              // console.log(Object.keys(profile));
              //console.log(profile);

              Object.keys(profile).forEach(prof_key => {
                msg[prof_key] = profile[prof_key];
              });

              if (profile.name) {
                msg.name = profile.name;
              } else {
                msg.name = profile.first_name + ' ' + profile.last_name;
              }

              if (index + 1 === total_msgs) {
                msgs.reverse();
                set(self, 'messages', msgs);
                resolve(msgs);
              }
            });
          });

        } else {
          set(self, 'messages', []);
          resolve([]);
        }
      });
    });
  },


  addEmployee(userId, jobTitle, isManager, requestObj){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let business_id = get(this, 'session').get('uid');
    let total = get(this, 'total');

    console.log('# Service : Notifications : addEmployee');
    console.log('userId :', userId);
    console.log('businessId :', business_id);
    console.log('requestId :', requestObj.request_id);
    console.log('jobTitle :', jobTitle);
    console.log('isManager :', isManager);

    let businessEmployeesRef = firebaseApp.database().ref('businessEmployees').child(business_id);

    let data = {
      created: Date.now(),
      job_title: jobTitle,
      manager: isManager
    };

    return new RSVP.Promise((resolve, reject) => {
      businessEmployeesRef.child(userId).once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        //userExistsCallback(userId, exists);
        console.log('# Service : Notifications : addEmployee : exists :', exists);

        if (exists) {
          resolve(true);

        } else {
          // resolve(false);
          businessEmployeesRef.child(userId).set(data).then(() => {
            self.removeRequest(requestObj.request_id).then(() => {
              self.requests.removeObject(requestObj);

              console.log('requests.length :', self.requests.length);

              if (self.requests.length  > 0 && total > 0) {
                self.decrementProperty('total');
              }

              let text = 'We added you as ' +  jobTitle;

              if (isManager) {
                text = 'We added you as ' +  jobTitle + '. You are also a manager.';
              }

              let userWorkplacesRef = firebaseApp.database().ref('userWorkplaces').child(userId).child(business_id);

              userWorkplacesRef.set({pending: false}).then(() => {
                self.sendMessage(userId, text).then(() => {
                  resolve(false);
                });
              });
            });
          });
        }
      });
    });
  },


  removeRequest(requestId){
    let firebaseApp = get(this, 'firebaseApp');
    let business_id = get(this, 'session').get('uid');
    let businessRef = firebaseApp.database().ref('businessRequests').child(business_id);
    let requestRef = businessRef.child(requestId);

    return requestRef.remove();
  },


  denyRequest(request){
    // console.log(request);

    let firebaseApp = get(this, 'firebaseApp');
    let business_id = get(this, 'session').get('uid');
    let businessRef = firebaseApp.database().ref('businessRequests').child(business_id);
    let requestRef = businessRef.child(request.request_id);

    let userWorkplacesRef = firebaseApp.database().ref('userWorkplaces').child(request.sender_uid).child(business_id);

    let msg = 'Your request has been denied';

    this.sendMessage(request.sender_uid, msg);
    userWorkplacesRef.remove();
    requestRef.remove();
  },


  sendMessage(userId, text){
    let firebaseApp = get(this, 'firebaseApp');
    let senderId = get(this, 'session').get('uid');
    let messagesRef = firebaseApp.database().ref('messages').child(userId);
    let user = get(this, 'user');

    return messagesRef.push({
      business: user.accountType.business,
      sender_uid: senderId,
      timestamp: Date.now(),
      text: text
    });
  },


  deleteMessage(messageObj){
    let firebaseApp = get(this, 'firebaseApp');
    let user_uid = get(this, 'session').get('uid');
    let messageRef = firebaseApp.database().ref('messages').child(user_uid).child(messageObj.message_id);

    return messageRef.remove();
  }
});
