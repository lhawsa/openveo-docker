'use strict';

require('./processRequire.js');
var crypto = require('crypto');
var path = require('path');
var async = require('async');
var nopt = require('nopt');
var openVeoAPI = require('@openveo/api');
var UserProvider = process.require('app/server/providers/UserProvider.js');
var confDir = path.join(openVeoAPI.fileSystem.getConfDir(), 'core');
var conf = require(path.join(confDir, 'conf.json'));
var databaseConf = require(path.join(confDir, 'databaseConf.json'));
var exit = process.exit;

// Process arguments
var knownProcessOptions = {
  name: [String],
  email: [String],
  password: [String]
};

// Parse process arguments
var processOptions = nopt(knownProcessOptions, null, process.argv);

async.series([

  // Connect to database
  function(callback) {
    var db = openVeoAPI.Database.getDatabase(databaseConf);
    db.connect(function(error) {
      if (error) {
        process.stdout.write('Could not connect to the database with message : ' + error.message);
        exit();
      }

      openVeoAPI.applicationStorage.setDatabase(db);
      callback();
    });
  },

  // Verify if the super admin does not exist
    function(callback) {
      var userProvider = new UserProvider(openVeoAPI.applicationStorage.getDatabase());
      userProvider.getOne('0', null, function(error, user) {
      if (user)
        callback(new Error('A super admin user already exists\n'));
      else if (error)
        callback(error);
      else
        callback();
    });
  },

  // Create super admin user
  function(callback) {

    var userProvider = new UserProvider(openVeoAPI.applicationStorage.getDatabase());

    if (!openVeoAPI.util.isEmailValid(processOptions.email))
      return callback(new Error('Invalid email, aborting\n'));

    var user = {
      id: '0',
      locked: true,
      name: processOptions.name,
      email: processOptions.email,
      password: crypto.createHmac('sha256', conf.passwordHashKey).update(processOptions.password).digest('hex')
    };

    userProvider.add(user, callback);
  },
], function(error, results) {
  if (error)
      process.stdout.write(error.message);
  else
     process.stdout.write('Super administrator successfully created\n');

  exit();
});
