import DS from 'ember-data';

export default DS.Model.extend({
  created: DS.attr('number'),
  job_title: DS.attr('string'),
  manager: DS.attr('boolean')
});
