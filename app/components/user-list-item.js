import Ember from 'ember';

const {
  Component,
  get,
  set
} = Ember;


export default Component.extend({
  classNames: ['user-list-item'],
  classNameBindings: ['clickable'],
  clickable: false,

  user: null,
  initials: null,
  action: null,
  icon: null,
  icon2: null,
  toggle: false,
  toggleState: false, // OFF true is ON
  order: false,
  orderIndex: null,
  orderNum: null,


  didReceiveAttrs(){
    this._super(...arguments);

    let user = get(this, 'user');
    let initials = user.first_name[0] + '' + user.last_name[0];

    set(this, 'initials', initials);

    if (get(this, 'action') || get(this, 'toggle')) {
      set(this, 'clickable', true);
    }

    if (get(this, 'order')) {
      set(this, 'orderNum', get(this, 'orderIndex') + 1);
    }
  },


  didInsertElement(){
    let self = this;
    this._super(...arguments);

    this.$('.user-list-item-profile').on('click', function(){
      if (get(self, 'toggle')) {
        self.toggleProperty('toggleState');
      }

      if (get(self, 'action')) {
        self.action();
      }
    });
  },


  willDestroyElement(){
    this._super(...arguments);
    this.$('.user-list-item-profile').off('click');
  }
});
