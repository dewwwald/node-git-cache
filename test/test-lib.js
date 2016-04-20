'use strict';

var cwd = process.cwd();

var gTools = require(cwd+'/main/git-tools.js')({
  repositories: ['dewwwald/tiny-test-repo'],
  branch: 'master',
  destination: '.tmp'
});

gTools.clone();
gTools.copy();
