'use strict';

module.exports = (opts) => {
  var repo, branch, exec, modulePubFuncs, main, testSSH, sshPass, promise, fs,
    sshRepo, repoBranch, repoCheck, repoDownload, dest, copyRepositories;

  // setup defaults
  fs = require('fs');
  dest = opts.destination;
  sshPass = false;
  repo = opts.repositories;
  branch = opts.branch;
  exec = require('child_process').exec;

  testSSH = function (cb, endCb) {
    // cb is main -> see clone
    exec('ssh -T git@github.com', function(error) {
      if (error.toString().indexOf("You've successfully authenticated") > 0) {
        sshPass = true;
        cb(endCb);
      }
    });
    return this;
  }

  sshRepo = function (repo) {
    // generate ssh clone cmd
    return 'git clone --verbose git@github.com:'+
    repo+
    '.git '+
    __dirname+
    '/.git_cache/'+
    repo.split('/').reverse()[0];
  }

  repoBranch = function (repo, cb) { // checkout and pull branch latest
    if (typeof cb === 'undefined') {
      cb = function () {return;}
    }
    exec('git checkout' + branch, {
      cwd: __dirname+'/.git_cache/'+ repo.split('/').reverse()[0]
    }, function (error, stOut, erSt) {
      exec('git pull --verbose', {
        cwd: __dirname+'/.git_cache/'+ repo.split('/').reverse()[0]
      }, function () {
        cb(repo);
      });
    });
  }

  repoCheck = function (repo, endCb) { // checks if the repo exists
    exec('git status', {
      cwd: __dirname+'/.git_cache/'+ repo.split('/').reverse()[0]
    }, function (error, stOut, erSt) {
      if (error) { return repoDownload(repo, endCb);}
      else { return repoBranch(repo, endCb);}
    });
  }

  repoDownload = function (repo, endCb) { // Downloads the repo to cache
    exec(sshRepo(repo), function (error, stOut, erSt) {
      if (error) { throw new Error(error);}
      else {
        repoBranch(repo, endCb);
      }
    });
  }

  main = function (endCb) { // main loop for module
    if (sshPass) {
      for (var i = 0; i < repo.length; i++) {
        repoCheck(repo[i], endCb);
      };
    }
    else {
      console.error('Either setup ssh or request an http feature.');
    }
  }

  copyRepositories = function (repo) {
    if (typeof repo === 'undefined') {
      repo = opts.repositories;
    }
    else {
      repo = [repo];
    }
    var cpTo, fileLocation;
    cpTo = __dirname + '/' + dest
    // #TODO: point relative path ../ to one up from __dirname
    for (var i = 0; i < repo.length; i++) {
      fileLocation = cpTo + '/' + repo[i].split('/').reverse()[0];
      exec('mkdir -p ' + cpTo + ' && cp -r '+
        __dirname+'/.git_cache/'+ repo[i].split('/').reverse()[0] +
        ' ' + fileLocation
      );
    };
  }

  modulePubFuncs = function () { // makes public functions availible
    return {
      clone: function (cb) {
        if (typeof cb === 'undefined') {
          cb = copyRepositories;
        }
        testSSH.call(this, main, cb);
      },
      copy: function () {
        copyRepositories();
      }
    }
  }

  // Return module
  return modulePubFuncs();
}
