#! /usr/bin/env node
var chalk = require('chalk');
var fs = require('fs');
var request = require('request');
var moment = require('moment');
var parseString = require('xml2js').parseString;

var BASE_URL = 'https://circleci.com/gh/';

fs.readFile('.circleci-rc', 'utf8', function (err, configrc) {
  if (err) return console.log(chalk.red('Error reading .circlerc file - does it exist?'));
  try {
    var config = JSON.parse(configrc);
    if (!config.repo) {
      console.log(chalk.red('Error: .circlerc file should contain a repo'));
      return process.exit(1);
    }

    var url = BASE_URL + config.repo + '.cc.xml?circle-token=' + config.token;

    request(url, function (error, response, body) {
      if (error) return console.log(chalk.red(error));
      if (response.statusCode !== 200) {
        console.log(chalk.red('CircleCI API returned HTTP ' + response.statusCode + ' - is your token correct?'));
        return process.exit(1);
      }

      parseString(body, function (err, result) {
        var activity = result['Projects']['Project'][0]['$']['activity'];
        var lastBuildStatus = result['Projects']['Project'][0]['$']['lastBuildStatus'];
        var lastBuildLabel = result['Projects']['Project'][0]['$']['lastBuildLabel'];
        var lastBuildTime = result['Projects']['Project'][0]['$']['lastBuildTime'];
        var webUrl = result['Projects']['Project'][0]['$']['webUrl'];

        switch (activity) {
          case 'Sleeping' :
            switch (lastBuildStatus) {
              case 'Success' :
                console.log(chalk.green('Success (Build: ' + lastBuildLabel + ') completed ' + moment(lastBuildTime).calendar()));
                return process.exit(0);
              case 'Failure' :
                console.log(chalk.red('Build Failure - Please check the repo at ' + webUrl));
                return process.exit(1);
              case 'Unknown' :
                console.log(chalk.cyan('Build Canceled - Please check the repo at ' + webUrl));
                return process.exit(1);
            }
            break;
          case 'Building' :
            console.log(chalk.blue.bold('Building...'));
            return process.exit(0);
          default:
            console.log(chalk.orange('Unknown'));
            return process.exit(1);
        }
      });
    });
  } catch (e) {
    console.log(chalk.red('Error reading .circlerc file - ' + e));
    return process.exit(1);
  }
});

