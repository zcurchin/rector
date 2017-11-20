import Ember from 'ember';

const {
  Component,
  inject: { service },
  get,
  set
} = Ember;


export default Component.extend({
  paperToaster: service(),
  notifications: service(),
  classNames: ['item'],
  item: null,

  respond: false,

  onDenyRequest: null,
  onApproveRequest: null,

  isInitial: true,
  isApprove: false,
  isDeny: false,

  isManager: false,

  selectedJobTitle: 'Server',

  jobTitles: [
    'Server',
    'Runner',
    'Expo',
    'Host',
    'Bartender',
    'Bar Back',
    'Barista',
    'Sommelier',
    'Polisher',
    'Porter'
  ],

  preloader: false,


  removeItem(){
    let notifications = get(this, 'notifications');
    let item = get(this, 'item');

    notifications.removeRequest(item);
  },


  actions: {
    toggleRespond(){
      this.toggleProperty('respond');

      set(this, 'isInitial', true);
      set(this, 'isApprove', false);
      set(this, 'isDeny', false);
    },


    addEmployee(){
      let self = this;
      let user = get(this, 'item');
      let notifications = get(this, 'notifications');
      let paperToaster = get(this, 'paperToaster');

      let jobTitle = get(this, 'selectedJobTitle');
      let isManager = get(this, 'isManager');

      let employeeName = user.first_name + ' ' + user.last_name;
      let successMsg = 'Successfully added ' + employeeName + ' as employee';
      let errorMsg = 'You already added ' + employeeName + ' to your employees list';

      notifications.addEmployee(user.uid, jobTitle, isManager, user).then(exists => {
        let toasterText = exists ? errorMsg : successMsg;

        paperToaster.show(toasterText, {
          duration: 7000,
          position: 'bottom right'
        });
      });
    },


    approveRequest(){
      let item = get(this, 'item');
      let onApproveRequest = get(this, 'onApproveRequest');
      set(this, 'isApprove', true);
      set(this, 'isDeny', false);
      set(this, 'isInitial', false);
      //onDenyRequest(item);
    },


    denyRequest(){
      let item = get(this, 'item');
      let onDenyRequest = get(this, 'onDenyRequest');
      set(this, 'isDeny', true);
      set(this, 'isApprove', false);
      set(this, 'isInitial', false);
      //onDenyRequest(item);
    }
  }
});
