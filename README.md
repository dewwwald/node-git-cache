# node-git-cache

A basic git clone and cache (using this term loosely) tool for nodejs.


Basic usage would be as follow.
```javascript
var gTools = require('node-git-cache')({
  repositories: ['dewwwald/tiny-test-repo'],
  branch: 'master',
  destination: __dirname+'/app/.tmp'
});

gTools.clone();
```
