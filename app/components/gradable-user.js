import Ember from 'ember';

const {
  Component,
  inject: { service },
  set,
  get
} = Ember;

export default Component.extend({
  grading: service(),
  paperToaster: service(),

  classNames: ['gradable-user'],
  grade: 4,
  selected: false,
  nei: false,
  showPreloader: false,
  showComment: false,
  comment: '',


  actions: {
    toggleGrading(){
      this.toggleProperty('selected');

      let selected = get(this, 'selected');

      console.log('selected:', selected);

      if (!selected) {
        set(this, 'grade', 4);
        set(this, 'nei', false);
      }
    },


    toggleComment(){
      this.toggleProperty('showComment');
    },


    setGrade(gradeValue){
      set(this, 'grade', gradeValue);

      if (gradeValue === 0) {
        set(this, 'nei', true);
      } else {
        if (gradeValue === 1 || gradeValue === 2) {
          set(this, 'showComment', true);
        } else {
          set(this, 'showComment', false);
        }

        set(this, 'nei', false);
      }
    },


    confirmGrade(id){
      let grading = get(this, 'grading');
      let paperToaster = get(this, 'paperToaster');
      let grade = get(this, 'grade');
      let first_name = get(this, 'first_name');
      let last_name = get(this, 'last_name');
      let comment = get(this, 'comment');
      let error_msg = 'You have to write comment if you want to grade user below grade 3';
      let success_msg = 'You successfully graded ' + first_name + ' ' + last_name;

      if ((grade === 1 || grade === 2) && !comment) {
        paperToaster.show(error_msg, {
          duration: 7000,
          position: 'bottom right'
        });

      } else {
        set(this, 'showPreloader', true);

        grading.gradeUser(id, grade, comment).then(() => {
          paperToaster.show(success_msg, {
            duration: 3000,
            position: 'bottom right'
          });
        });
      }
    }
  }
});
