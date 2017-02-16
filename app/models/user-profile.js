import DS from 'ember-data';
import Ember from 'ember';

const {
  Model,
  hasMany,
  attr
} = DS;

const {
  computed
} = Ember;

export default Model.extend({
  first_name: attr('string'),
  last_name: attr('string'),
  full_name: computed('first_name', 'last_name', function() {
    return `${this.get('first_name')} ${this.get('last_name')}`;
  }),
  username: attr('string'),
  state: attr('string', { defaultValue() { return ''; } }),
  zipcode: attr('string', { defaultValue() { return ''; } }),
  city: attr('string', { defaultValue() { return ''; } }),
  street_name: attr('string', { defaultValue() { return ''; } }),
  street_num: attr('string', { defaultValue() { return ''; } }),
  profile_image: attr('string', { defaultValue() { return ''; } }),

  public_grades: hasMany('publicGrade', { async: true, inverse: null })
});
