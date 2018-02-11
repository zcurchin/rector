import Ember from 'ember';

const {
  Component,
  inject: { service },
  set,
  get
} = Ember;


export default Component.extend({
  grading: service(),

  classNames: ['app-page-card'],
  classNameBindings: ['preloader'],

  title: null,
  resizeable: null,
  folded: false,
  info: null,
  info_on: false,
  headerAction: null,
  headerActionLabel: null,
  header: true,
  refreshAction: null,
  preloader: false,

  actions: {
    toggleFolding(){
      this.toggleProperty('folded');
    },


    toggleInfo(){
      this.toggleProperty('info_on');
    },


    refresh(){
      let self = this;
      let refreshAction = get(this, 'refreshAction');

      set(this, 'preloader', true);

      if (refreshAction === 'refreshGrading') {
        let grading = get(this, 'grading');

        grading.refreshGrading().then(() => {
          set(self, 'preloader', false);
        });
      }
    }
  }
});
