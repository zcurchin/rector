import DS from 'ember-data';

export default DS.Model.extend({
  auth_uid: DS.attr('String'),
  first_name: DS.attr('String'),
  last_name: DS.attr('String'),
  full_name: Ember.computed('first_name', 'last_name', function() {
    return `${this.get('first_name')} ${this.get('last_name')}`;
  }),
  email: DS.attr('String'),
  job_title: DS.attr('String', { defaultValue: '' })

});
