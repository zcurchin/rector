import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Controller,
  set,
  get,
  inject: { service }
} = Ember;

export default Controller.extend({
  firebaseApp: service(),
  user: service(),

  findingWorkplace: false,
  searchQuery: '',
  searchResults: null,
  selectedBusiness: null,

  waiting: false,
  success: false,
  error: false,
  errorMsg: 'Failed to send request',


  sendRequest(dialog){
    let target = dialog._targetObject;
    let query = target.searchQuery;
    let selectedBusiness = target.selectedBusiness;

    dialog.set('waiting', true);

    if (!selectedBusiness) {
      dialog.set('waiting', false);
      dialog.set('error', true);
      dialog.set('errorMsg', 'You did not select any business to send request to');

    } else {
      let userId = target.session.content.uid;
      let businessId = selectedBusiness.uid;

      target.sendRequestToBusiness(userId, businessId).then(() => {
        dialog.set('success', true);

      }).catch(err => {
        dialog.set('error', true);
        dialog.set('errorMsg', 'Sending request failed! Please try again later.');
      });
    }
  },


  sendRequestToBusiness(userId, businessId){
    let self = this;
    let firebaseApp = get(this, 'firebaseApp');
    let businessRequests = firebaseApp.database().ref('businessRequests');

    let data = {
      timestamp: Date.now(),
      sender_uid: userId
    };

    return new RSVP.Promise((resolve, reject) => {
      businessRequests.child(businessId).push(data).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },


  onCancelDialog(dialog){
    let self = dialog._targetObject;

    set(self, 'searchQuery', '');
    set(self, 'searchResults', null);
    set(self, 'selectedBusiness', null);
  },


  actions: {
    selectBusiness(item){
      $('.busines-search-results .item').each(function(){
        $(this).toggleClass('selected', false);
      });

      $('#'+item.uid).toggleClass('selected', true);
      set(this, 'selectedBusiness', item);
    },


    showFinder(){
      set(this, 'findingWorkplace', true);
    },


    queryChanged(data){
      let self = this;
      set(this, 'searchQuery', data);

      if (data.length > 3) {
        let firebaseApp = get(this, 'firebaseApp');
        let businessProfiles = firebaseApp.database().ref('businessProfiles');

        let query = data.charAt(0).toUpperCase() + data.slice(1);

        businessProfiles.orderByChild('name').startAt(query).endAt(query+"\uf8ff").once('value').then(snap => {
          if (snap.val() !== null) {
            let results = [];

            Object.keys(snap.val()).forEach(key => {

              let obj = snap.val()[key];
              obj.uid = key;
              results.push(obj);
            });

            set(self, 'searchResults', results);

          } else {
            set(self, 'searchResults', null);
          }
        });

      } else if (data.length === 0) {
        set(self, 'searchResults', null);
        set(self, 'selectedBusiness', null);
      }
    }
  }
});
