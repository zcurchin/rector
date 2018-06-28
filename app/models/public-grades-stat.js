import DS from 'ember-data';

export default DS.Model.extend({
  average: DS.attr('number'),
  total: DS.attr('number'),
  one: DS.attr('number'),
  two: DS.attr('number'),
  three: DS.attr('number'),
  four: DS.attr('number'),
  five: DS.attr('number')
});
