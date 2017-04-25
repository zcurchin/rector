import Ember from 'ember';

const {
  Component,
  get,
  set
} = Ember;


export default Component.extend({
  classNames: ['app-page-card'],
  title: null,
  resizeable: null,
  folded: false,
  info: null,
  info_on: false,
  headerAction: null,
  headerActionLabel: null,
  header: true,

  actions: {
    toggleFolding(){
      this.toggleProperty('folded');
    },

    toggleInfo(){
      this.toggleProperty('info_on');
    },

    headerAction(){
      console.log('LLLLLLLLOOOOOLLLLLLL');
    }    
  }
});
