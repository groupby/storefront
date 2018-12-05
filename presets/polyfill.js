import * as bowser from 'bowser';
import polyfill from 'dynamic-polyfill'

export default (cb) => {
  if (bowser.msie) {
    polyfill({
      fills: [
        'Array.from',
        'Array.prototype.find',
        'Array.prototype.findIndex',
        'Array.prototype.includes'
      ],
      options: ['gated'],
      minify: true,
      rum: false,
      afterFill() {
        cb();
      }
    });
  } else {
    cb();
  }
};
