# node-git-cache

A basic git clone and cache (using this term loosely) tool for nodejs.


Basic usage would be as follow.
```javascript
var gTools = require('node-git-cache')({
  repositories: ['dewwwald/tiny-test-repo'],
  branch: 'master',
  destination: __dirname+'/app/.tmp'
});

gTools.clone(function () {
  console.log('Copying is complete');
});
```

## TODO
- We still need to make this structure better (maybe use promises)
- Make clone and copy chainable
- Improve structure where possible

## Feedback
This was my first attempt at writing a Node plugin. Please provide feedback and report issues on the [github issue tracker](https://github.com/dewwwald/node-git-cache/issues).
