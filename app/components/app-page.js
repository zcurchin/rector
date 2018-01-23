import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import Ember from 'ember';

const {
  Component
} = Ember;

export default Component.extend(RecognizerMixin, {
  recognizers: 'swipe',
  classNames: ['app-page'],
  title: null,
  classNameBindings: ['contentReady:hidden-preloader:visible-preloader'],
  contentReady: null
});
