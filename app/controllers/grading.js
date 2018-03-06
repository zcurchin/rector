import Ember from 'ember';

const {
  Controller,
  inject: { service }
} = Ember;


export default Controller.extend({
  firebaseApp: service(),
  grading: service(),
  checking: service(),
  workplace: service(),
  preloader: false,
  yesterdayInfo: false,


  actions: {
    toggleYesterdayInfo(){
      this.toggleProperty('yesterdayInfo');
    }
  }
});
