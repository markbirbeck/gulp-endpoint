#!/usr/bin/env node

/**
 * Initialise gulp with the tasks:
 */

var gulp = require('gulp');
require(process.cwd() + '/gulpfile.js');

/**
 * Now wrap those tasks:
 */

var wrap = require('../');
wrap(gulp);
