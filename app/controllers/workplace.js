import Ember from 'ember';

const {
  Controller,
  set,
  get,
  inject: { service }
} = Ember;

export default Controller.extend({
  firebaseApp: service(),

  findingWorkplace: false,
  searchQuery: '',
  searchResults: null,

  waiting: false,
  success: false,
  error: false,
  errorMsg: 'Failed to send request',


  sendRequest(dialog){
    let target = dialog._targetObject;
    let query = target.searchQuery;
    let selectedBusiness = dialog.selectedBusiness;
    console.log(query, selectedBusiness);
    //console.log(query);
    dialog.set('waiting', true);

    if (!selectedBusiness) {
      dialog.set('error', true);
      dialog.set('errorMsg', 'You did not select any business to send request to');
    }
  },


  actions: {
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

        console.log(query);

        businessProfiles.orderByChild('name').startAt(query).once('value').then(snap => {
          console.log(snap.val());
          if (snap.val() !== null) {
            let results = [];

            Object.keys(snap.val()).forEach(key => {
              results.push(snap.val()[key]);
            });

            set(self, 'searchResults', results);
          } else {
            set(self, 'searchResults', null);
          }
        });
      }
    }
  }
});
