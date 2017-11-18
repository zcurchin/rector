import Ember from 'ember';

const {
  Component,
  inject: { service },
  get,
  set
} = Ember;


export default Component.extend({
  notifications: service(),
  classNames: ['item'],
  item: null,

  respond: false,

  onDenyRequest: null,
  onApproveRequest: null,

  isInitial: true,
  isApprove: false,
  isDeny: false,

  selectedJobTitle: 'server',

  jobTitles: [
    'server',
    'runner',
    'expo',
    'host',
    'bartender',
    'bar back',
    'barista',
    'sommelier',
    'polisher',
    'porter'
  ],


  actions: {
    toggleRespond(){
      this.toggleProperty('respond');

      set(this, 'isInitial', true);
      set(this, 'isApprove', false);
      set(this, 'isDeny', false);
    },


    removeItem(){
      let notifications = get(this, 'notifications');
      let item = get(this, 'item');

      notifications.removeRequest(data);
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
