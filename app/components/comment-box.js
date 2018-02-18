import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend({
  classNames: ['comment-box', 'layout-row', 'layout-align-center-center'],
  classNameBindings: ['folded'],
  folded: true,


  click(){
    this.toggleProperty('folded');
  }
});
