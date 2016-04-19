'use strict';

module.exports = (opts) => {
  var repo, branch, exec, modulePubFuncs, main, testSSH, sshPass,
    sshRepo, repoBranch, repoCheck, repoDownload;

  // setup defaults
  sshPass = false;
  repo = opts.repositories;
  branch = opts.branch;
  exec = require('child_process').exec;

  testSSH = function (cb) {
    // cb is main -> see clone
    exec('ssh -T git@github.com', function(error) {
      if (error.toString().indexOf("You've successfully authenticated") > 0) {
        sshPass = true;
        return cb();
      }
    });
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

  repoBranch = function (repo) { // checkout and pull branch latest
    exec('git checkout' + branch, {
      cwd: __dirname+'/.git_cache/'+ repo.split('/').reverse()[0]
    }, function (error, stOut, erSt) {
      exec('git pull --verbose', {
        cwd: __dirname+'/.git_cache/'+ repo.split('/').reverse()[0]
      });
    });
  }

  repoCheck = function (repo) { // checks if the repo exists
    exec('git status', {
      cwd: __dirname+'/.git_cache/'+ repo.split('/').reverse()[0]
    }, function (error, stOut, erSt) {
      if (error) { repoDownload(repo);}
      else { repoBranch(repo);}
    });
  }

  repoDownload = function (repo) { // Downloads the repo to cache
    exec(sshRepo(repo), function (error, stOut, erSt) {
      if (error) { console.error(error);}
      else {
        repoBranch(repo);
      }
    });
  }

  main = function () { // main loop for module
    if (sshPass) {
      for (var i = 0; i < repo.length; i++) {
        repoCheck(repo[i]);
      };
    }
    else {
      console.error('Either setup ssh or request an http feature.');
    }
  }

  modulePubFuncs = function () { // makes public functions availible
    return {
      clone: function () {
        testSSH(main);
      }
    }
  }

  // Return module
  return modulePubFuncs();
}
