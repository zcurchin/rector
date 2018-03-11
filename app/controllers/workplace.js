import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Controller,
  inject: { service },
  set,
  get,
  $
} = Ember;


export default Controller.extend({
  firebaseApp: service(),
  user: service(),
  workplace: service(),

  findingWorkplace: false,
  searchQuery: '',
  searchResults: null,
  selectedBusiness: null,

  waiting: false,
  success: false,
  error: false,
  errorMsg: 'Failed to send request',

  cancelingEmpolyement: false,
  ce_waiting: false,
  ce_success: false,
  ce_error: false,

  cancelingRequest: false,
  cr_waiting: false,
  cr_success: false,
  cr_error: false,


  sendRequest(dialog){
    let target = dialog._targetObject;
    //let query = target.searchQuery;
    let selectedBusiness = target.selectedBusiness;

    console.log('### sendRequest : selectedBusiness :', selectedBusiness);

    dialog.set('waiting', true);

    if (!selectedBusiness) {
      //dialog.set('waiting', false);
      dialog.set('error', true);
      dialog.set('errorMsg', 'You did not select any business to send request to');

    } else {
      let userId = target.session.content.uid;
      let businessId = selectedBusiness.uid;

      target.sendRequestToBusiness(userId, businessId).then(() => {
        dialog.set('success', true);

      }).catch(() => {
        dialog.set('error', true);
        dialog.set('errorMsg', 'Sending request failed! Please try again later.');
      });
    }
  },


  sendRequestToBusiness(userId, businessId){
    let workplace = get(this, 'workplace');

    return workplace.sendRequest(userId, businessId);
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

      if (data.length > 2) {
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
    },


    cancelEmployement(){
      let workplace = get(this, 'workplace');

      set(this, 'ce_waiting', true);

      workplace.cancelEmployement().then(() => {
        set(this, 'ce_success', true);
      });
    },


    promptCancelEmployement(){
      set(this, 'cancelingEmpolyement', true);
    },


    cancelRequest(){
      let workplace = get(this, 'workplace');

      set(this, 'cr_waiting', true);

      workplace.cancelRequest().then(() => {
        set(this, 'cr_success', true);
      });
    },


    promptCancelRequest(){
      set(this, 'cancelingRequest', true);
    }
  }
});
