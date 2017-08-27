import Ember from 'ember';
import PaperDialog from 'ember-paper/components/paper-dialog';

const {
  set
} = Ember;


export default PaperDialog.extend({
  info: null,
  showInfo: false,
  header: true,
  title: null,
  active: null,
  bottomMargin: true,
  onClosed: null,

  willDestroyElement() {
    this._super(...arguments);

    if (this.onClosed) { this.onClosed(); }
  },

  actions: {
    close(){
      set(this, 'active', false);
    },

    toggleInfo(){
      this.toggleProperty('showInfo');
    }
  }
});
