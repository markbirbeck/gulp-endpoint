var wrapper = require('./lib/api');

var _src;
var _dest;

var wireTasks = function(gulp) {

  /**
   * Save a reference to the gulp src() and dest() functions:
   */

  _src = _src || gulp.src;
  _dest = _dest || gulp.dest;

  /**
   * Wire the gulp tasks in to the wrapper:
   */

  Object.keys(gulp.tasks).forEach(function(taskName) {
    wrapper.wire(taskName, function(params, src, dest, cb) {

      /**
       * Override the gulp src() and dest() methods before running the task:
       */

      gulp.src = (src) ? src : _src;
      gulp.dest = (dest) ? dest : _dest;
      gulp._params = Object.assign({}, params);
      gulp.start(taskName, cb);
    });
    console.log('Wired in task:', taskName);
  });
};

module.exports = wireTasks;
