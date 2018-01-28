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

  //categories of staff: Server, lounge server,  Busser, Runner, Host, Expo, Bartender, Barback, Sommalier; Managers: GM, AGM, Floor manager, event manager

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
      if (get(this, 'preloader')) { return; }

      console.log('# Component : notifyItem : addEmployee');

      let self = this;
      let user = get(this, 'item');
      let notifications = get(this, 'notifications');
      let paperToaster = get(this, 'paperToaster');

      let jobTitle = get(this, 'selectedJobTitle');
      let isManager = get(this, 'isManager');

      let employeeName = user.first_name + ' ' + user.last_name;
      let successMsg = 'Successfully added ' + employeeName + ' as employee';
      let errorMsg = 'You already added ' + employeeName + ' to your employees list';

      set(self, 'preloader', true);

      notifications.addEmployee(user.sender_uid, jobTitle, isManager, user).then(exists => {
        let toasterText = exists ? errorMsg : successMsg;

        if (exists) {
          set(self, 'preloader', false);
          set(self, 'respond', false);
        }

        paperToaster.show(toasterText, {
          duration: 7000,
          position: 'bottom right'
        });
      });
    },


    approveRequest(){
      set(this, 'isApprove', true);
      set(this, 'isDeny', false);
      set(this, 'isInitial', false);
    },


    promptDenyRequest(){
      set(this, 'isDeny', true);
      set(this, 'isApprove', false);
      set(this, 'isInitial', false);
    },


    denyRequest(){
      let notifications = get(this, 'notifications');      
      let request = get(this, 'item');

      notifications.denyRequest(request);
    },


    deleteMessage(){
      let item = get(this, 'item');
      let notifications = get(this, 'notifications');
      let paperToaster = get(this, 'paperToaster');

      let toasterText = 'Successfully deleted message from ' + item.name;

      set(this, 'preloader', true);

      notifications.deleteMessage(item).then(() => {
        paperToaster.show(toasterText, {
          duration: 7000,
          position: 'bottom right'
        });
      });
    }
  }
});
