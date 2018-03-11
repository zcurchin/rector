import Ember from 'ember';

const {
  Component,
  inject: { service },
  observer,
  set,
  get
} = Ember;


export default Component.extend({
  grading: service(),
  ranking: service(),
  employees: service(),

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

  rankListSelectedPeriod: {
    value: 'this_week',
    label: 'This week'
  },


  init(){
    this._super(...arguments);

    let rankListPeriods = get(this, 'rankListPeriods');

    set(this, 'rankListSelectedPeriod', rankListPeriods[0]);
  },

  onPeriodChange: observer('rankListSelectedPeriod', function(){
    let ranking = get(this, 'ranking');
    let period = get(this, 'rankListSelectedPeriod.value');

    set(ranking, 'period', period);
  }),

  rankListPeriods: [{
    value: 'this_week',
    label: 'This week'
  }, {
    value: 'last_week',
    label: 'Last week'
  }, {
    value: 'this_month',
    label: 'This month'
  }, {
    value: 'last_month',
    label: 'Last month'
  }],


  // init(){
  //   this._super(...arguments);
  // },


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

      } else if (refreshAction === 'refreshRankList') {
        let ranking = get(this, 'ranking');

        ranking.createList().then(() => {
          set(self, 'preloader', false);
        });

      } else if (refreshAction === 'refreshEmployees') {
        let employees = get(this, 'employees');

        employees.createList().then(() => {
          set(self, 'preloader', false);
        });
      }
    },


    periodChanged(){
      console.log('PERIOD CHANGED');
    }
  }
});
