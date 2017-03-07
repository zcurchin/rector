import Ember from 'ember';

const {
  Component,
  inject: { service },
  $,
  get,
  run
} = Ember;

export default Component.extend({
  classNames: ['app-container'],
  session: service(),

  // setContainerDims(){
  //   console.log('# setContainerDims');
  //   $('.app-container').css({
  //     height: $(window).height(),
  //     width: $(window).width()
  //   });
  // },


  didInsertElement(){
    let self = this;
    //let setContainerDims = get(this, 'setContainerDims');

    // setContainerDims();
    //
    // $(window).on('resize', () => {
    //   run.debounce(self, setContainerDims, 200);
    // });
  },


  actions: {
    signOut(){
      this.get('router').transitionTo('sign-in');
      this.get('session').close();
    }
  }
});
