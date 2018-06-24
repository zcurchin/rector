import DS from 'ember-data';

export default DS.Model.extend({
  test: DS.attr('string'),
  pending: DS.attr('boolean')
});
