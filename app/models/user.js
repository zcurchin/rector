import DS from 'ember-data';

export default DS.Model.extend({
  auth_uid: DS.attr('String'),
  first_name: DS.attr('String'),
  last_name: DS.attr('String'),
  full_name: Ember.computed('firstName', 'lastName', function() {
    return `${this.get('firstName')} ${this.get('lastName')}`;
  }),
  email: DS.attr('String'),
  job_title: DS.attr('String', { defaultValue: '' })

});
