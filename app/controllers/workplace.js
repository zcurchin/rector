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
  selectedBusiness: null,

  waiting: false,
  success: false,
  error: false,
  errorMsg: 'Failed to send request',


  sendRequest(dialog){
    let target = dialog._targetObject;
    let query = target.searchQuery;
    let selectedBusiness = target.selectedBusiness;
    console.log(selectedBusiness);
    //console.log(query);
    dialog.set('waiting', true);

    if (!selectedBusiness) {
      dialog.set('error', true);
      dialog.set('errorMsg', 'You did not select any business to send request to');
    }
  },


  onCancelDialog(dialog){
    console.log(dialog._targetObject);
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

        console.log(query);

        businessProfiles.orderByChild('name').startAt(query).endAt(query+"\uf8ff").once('value').then(snap => {
          console.log(snap.val());
          // console.log(Object.keys(snap.val()).length);
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
