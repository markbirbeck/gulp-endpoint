Sometimes we want to pipe files from a web server into Gulp.

And sometimes we want to pipe files out of Gulp into a web server.

But sometimes we just want to Gulp to actually *be* a web server.

Look at this:

```javascript
gulp.task('abc', function() {

});

gulp.task('xyz', function() {

});
```

Doesn't that look a little bit like an API?

So let's wrap Gulp, and expose the tasks as Express endpoints.

To use simply install `gulp-endpoint`:

```shell
npm install --save gulp-endpoint
```

and then run `endpoint` from the command-line:

```shell
endpoint
```

This will load your `gulpfile`, setting up a route for each task, and then launching a server on the default port, 3000.

To select another port either define the `PORT` environment variable:

```shell
PORT=3005 endpoint
```

or use the `--port` command line option:

```shell
endpoint --port 3005
```
