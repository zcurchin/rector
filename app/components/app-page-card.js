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
  folding_icon: 'expand-less',
  headerAction: null,
  headerActionLabel: null,
  header: true,

  actions: {
    toggleFolding(){
      this.toggleProperty('folded');

      if (get(this, 'folded')) {
        set(this, 'folding_icon', 'expand-more');
      } else {
        set(this, 'folding_icon', 'expand-less');
      }
    },

    headerAction(){
      console.log('LLLLLLLLOOOOOLLLLLLL');
    }
  }
});
