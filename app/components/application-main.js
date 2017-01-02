import Ember from 'ember';

const {
  Component,
  inject: { service },
  $,
  get,
  run
} = Ember;

export default Component.extend({
  session: service(),

  setContainerDims(){
    console.log('# setContainerDims');
    $('.app-container').css({
      height: $(window).height(),
      width: $(window).width()
    });
  },

  didInsertElement(){
    let self = this;
    let setContainerDims = get(this, 'setContainerDims');

    setContainerDims();

    $(window).on('resize', () => {
      run(self, setContainerDims, 200, false);
    });
  },

  actions: {
    signOut(){
      this.get('session').close();
      this.get('router').transitionTo('sign-in');
    }
  }

});
