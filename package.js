Package.describe({
  name: 'worldsayshi:meteor-idris',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});
/*
Package.onUse(function(api) {
//  api.versionsFrom('1.1.0.2')
    //api.addFiles('meteor-idris.js');
});*/

Package.onTest(function(api) {
    api.use('tinytest');

//  api.use('worldsayshi:meteor-idris');
  api.addFiles('meteor-idris-tests.js');
});

Package.registerBuildPlugin({
    name:"idris-meteor",
    sources: ["meteor-idris.js"],
    use:["underscore"]
});
