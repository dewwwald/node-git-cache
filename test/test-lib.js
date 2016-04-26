'use strict';

var cwd = process.cwd();

var gTools = require(cwd+'/main/git-tools.js')({
  repositories: ['dewwwald/tiny-test-repo'],
  branch: 'master',
  destination: __dirname+'/app/.tmp'
});

gTools.clone(function () {
  console.log('test is done');
});

