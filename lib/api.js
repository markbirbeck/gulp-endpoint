var _ = require('lodash');
var File = require('vinyl');
var es = require('event-stream');
var h = require('highland');

var express = require('express');
var cors = require('cors');
let secret = process.env.JWT_SECRET;
let authenticate;

if (secret) {
  const expressJwt = require('express-jwt');

  authenticate = expressJwt({secret : secret});
}

var app = express();

app.use(cors());

var wire = function(taskName, action) {
  var handleTask = function(req, res) {

    /**
     * Collect any uploaded data:
     */

    var data = '';
    req.on('data', function(chunk) {
      data += chunk.toString();
    });

    var src = function(glob, opt) {
      opt = opt || {};

      return es.readable(function read(count, cb) {
        var file = new File({
          path: 'uploaded-file',
          contents: new Buffer(data)
        });
        file.meta = req.headers;
        cb(null, file);
        this.emit('end');
      });
    };

    var dest = function(glob, opt) {
      opt = opt || {};

      return h().doto(function write(_file) {

        /**
         * Gulp is using an older version of Vinyl so wrap our file object
         * with the latest version:
         *
         * (The File object doesn't copy custom properties so we need to
         * do it.)
         */

        var file = new File(_file);

        file.meta = _file.meta;

        /**
         * Combine any options passed here with options on the file itself,
         * giving priority to the options passed in:
         */

        _.merge({}, file.meta, opt);

        /**
         * If we can get a content type from the file name then use that,
         * otherwise see if one is set in the meta property:
         */

        /**
         * [TODO] The sequence should probably be:
         *
         *  - use opt first;
         *  - then use the file's name;
         *  - and then finally use the file's meta.
         */

        if (file.path && file.extname) {
          res.type(file.extname);
        } else if (opt['content-type']) {
          res.set('Content-Type', opt['content-type']);
        }
        res.send(file.contents);
      });
    };

    /**
     * If there is no data being received then don't bother overriding
     * src():
     */

    req.on('end', function() {
      action(
        Object.assign({}, req.params, req.query, req.user),
        req.method === 'POST' ? src : undefined,
        dest,
        function(err) {
          if (err) {
            res.status(500);
          }
        }
      );
    });
  };

  /**
   * [TODO] Can probably make this a little bit more efficient, although
   * with closures I'm not seeing how!
   */

  if (authenticate) {
    app.get('/' + (taskName === 'default' ? '' : taskName), authenticate, handleTask);
    app.post('/' + (taskName === 'default' ? '' : taskName), authenticate, handleTask);
  } else {
    app.get('/' + (taskName === 'default' ? '' : taskName), handleTask);
    app.post('/' + (taskName === 'default' ? '' : taskName), handleTask);
  }
};


/**
 * Grab any command-line arguments:
 */

var minimist = require('minimist');
var knownOptions = {
  string: 'port',
  default: {port: process.env.PORT || 3000}
};
var options = minimist(process.argv.slice(2), knownOptions);

var server = app.listen(options.port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at %s:%d', host, port);
  if (authenticate) {
    console.log('Endpoint has been secured for JWT tokens');
  }
});

exports.wire = wire;
