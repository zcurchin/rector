import Ember from 'ember';
import moment from 'moment';

const {
  Component
} = Ember;

export default Component.extend({
  classNames: ['checkin-history-item'],
  folded: true,
  hours: null,
  check: null,


  didReceiveAttrs() {
    this._super(...arguments);

    let check = this.get('check');
    let miliseconds_delta = check.out - check.in;
    let hours = miliseconds_delta / (1000*60*60);

    this.set('hours', moment.duration(hours, 'hours').humanize());
  },


  didInsertElement(){
    let self = this;

    this.$().on('click', function(){
      self.toggleProperty('folded');
    });
  }
});
