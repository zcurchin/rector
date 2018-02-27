import Ember from 'ember';

const {
  Component,
  computed,
  get,
  set
} = Ember;

export default Component.extend({
  unsortedList: null,

  // sortBy: 'average_grade',
  sortBy: 'default',
  sortByAverageGrade: true,

  reverseSort: true,
  sortDefinition: computed('sortBy', 'reverseSort', function(){
    let sortOrder = get(this, 'reverseSort') ? 'desc' : 'asc';
    let sort_str = get(this, 'sortBy') + ':' + sortOrder;

    return [sort_str];
  }),

  sortedList: computed.sort('unsortedList', 'sortDefinition'),


  didReceiveAttrs() {
    this._super(...arguments);

    let props = get(this, 'props');
    let labels = get(this, 'labels');
    let sortBy = get(this, 'sortBy');

    if (sortBy === 'default') {
      set(this, 'sortBy', props[0]);
      set(this, 'label', labels[0]);
    }
  },


  actions: {
    toggleSortProp(){
      let sortBy = get(this, 'sortBy');
      let props = get(this, 'props');
      let labels = get(this, 'labels');

      let currentIndex = props.indexOf(sortBy);

      // console.log(currentIndex, props.length);

      if (currentIndex + 1 === props.length) {
        set(this, 'sortBy', props[0]);
        set(this, 'label', labels[0]);

      } else {
        set(this, 'sortBy', props[currentIndex + 1]);
        set(this, 'label', labels[currentIndex + 1]);
      }
    },


    toggleSortDirection(){
      this.toggleProperty('reverseSort');
    }
  }
});
