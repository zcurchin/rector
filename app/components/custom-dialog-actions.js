import Ember from 'ember';

const {
  Component,
  observer,
  get,
  set
} = Ember;

export default Component.extend({
  active: false,
  confirmAction: null,

  waiting: false,
  success: false,
  error: false,
  successMsg: '',
  errorMsg: '',

  onDialogClose: observer('active', function(){
    let active = get(this, 'active');

    console.log('Dialog active changed :', active);

    if (!active) {
      console.log('DIALOG CLOSED');
    }
  }),

  closeActions(){
    set(this, 'waiting', false);
    set(this, 'success', false);
    set(this, 'error', false);
  },

  actions: {
    closeDialog(){
      set(this, 'active', false);
      this.closeActions();
    },


    closeActions(){
      this.closeActions();
    },


    confirm(){
      this.confirmAction();
    }
  }
});