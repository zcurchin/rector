import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('number'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  username: DS.attr('string'),
  country: DS.attr('string'),
  state: DS.attr('string'),
  city: DS.attr('string'),
  zipcode: DS.attr('number')
});
