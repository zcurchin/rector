import Ember from 'ember';

const {
  Component,
  set,
  get,
  computed
} = Ember;

export default Component.extend({
  classNames: ['gradable-user'],
  grade: 0,
  graded: false,
  selected: false,
  isChanged: false,
  nei: false,
  preloader: false,

  confirmBtnClass: computed('isChanged', function () {
    let isChanged = get(this, 'isChanged');

    console.log(isChanged);

    if (isChanged) {
      return 'enabled';
    } else {
      return 'disabled';
    }
  }).property('isChanged'),


  actions: {
    toggleGrading(){
      this.toggleProperty('selected');

      let selected = get(this, 'selected');

      console.log('selected:', selected);

      if (!selected) {
        set(this, 'grade', 0);
        set(this, 'isChanged', false);
        set(this, 'nei', false);
      }
    },

    setGrade(gradeValue){
      console.log(gradeValue);
      set(this, 'grade', gradeValue);
      set(this, 'isChanged', true);

      if (gradeValue === 0) {
        set(this, 'nei', true);
      } else {
        set(this, 'nei', false);
      }
    },

    confirmGrade(id){
      let isChanged = get(this, 'isChanged');
      let grade = get(this, 'grade');

      if (isChanged) {
        set(this, 'graded', true);
        this.sendAction('action', id, grade);
      }
    }
  }
});
