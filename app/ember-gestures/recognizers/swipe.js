export default {
  include: [],
  exclude: [],
  options: {
    threshold: 25,
    direction: typeof window.Hammer === 'undefined' ? '' : window.Hammer.DIRECTION_HORIZONTAL },
  recognizer: 'swipe'
};
