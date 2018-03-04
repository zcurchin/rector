import Ember from 'ember';

const {
  Component,
  get,
  set
} = Ember;


export default Component.extend({
  classNames: ['user-list-item', 'layout-row', 'layout-align-start-center'],
  classNameBindings: ['clickable'],
  clickable: false,

  user: null,
  initials: null,
  action: null,
  icon: null,
  toggle: false,
  toggleState: false, // OFF true is ON


  didReceiveAttrs(){
    this._super(...arguments);

    let user = get(this, 'user');
    let initials = user.first_name[0] + '' + user.last_name[0];

    set(this, 'initials', initials);

    if (get(this, 'action')) {
      set(this, 'clickable', true);
    }
  },


  click(){
    if (get(this, 'toggle')) {
      this.toggleProperty('toggleState');
    }

    if (get(this, 'action')) {
      this.action();      
    }
  }
});
