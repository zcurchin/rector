import PaperInput from 'ember-paper/components/paper-input';

export default PaperInput.extend({
  passwordIcon: 'visibility',

  didRender(){
    this._super(...arguments);

    this.$('input').attr({
      autocomplete: "off",
      autocorrect: "off",
      autocapitalize: "off",
      spellcheck: "false"
    });
  },

  actions: {
    togglePasswordVisibility(){
      let $input = this.$('input');
      let type = $input.attr('type');

      if (type === 'text') {
        this.set('passwordIcon', 'visibility');
        $input.attr('type', 'password');

      } else if (type === 'password') {
        this.set('passwordIcon', 'visibility-off');
        $input.attr('type', 'text');
      }
    }
  }
});
