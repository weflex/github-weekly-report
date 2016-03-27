#!/usr/bin/env node

'use strict';

const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const vorpal = require('vorpal')();
const primisify = require('es6-promisify');
const Github = require('octop');
const Table = require('cli-table');
const Event = require('./lib/event');
let githubrc = readGithubrc();

function readGithubrc() {
  try {
    const buf = fs.readFileSync('./.githubrc', 'utf8');
    return JSON.parse(buf);
  } catch (err) {
    return null;
  }
}

function writeGithubrc(config) {
  if (!config || !config.token) {
    throw new TypeError('Invalid Github Report');
  }
  fs.writeFileSync('./.githubrc',
    JSON.stringify(config, null, 2), 'utf8');
  // refresh the current config
  githubrc = config;
}

vorpal
  .command('config', 'config your reports')
  .action(function(args, callback) {
    let self = this;
    self.prompt([{
      type: 'input',
      name: 'token',
      message: 'Github Personal Token? ',
    }, {
      type: 'input',
      name: 'username',
      message: 'Github username? ',
    }, {
      type: 'input',
      name: 'org',
      message: 'Github organization? ',
    }], function(result) {
      self.log(result);
      writeGithubrc(result);
      self.log('config has been wrote to .githubrc');
      callback();
    });
  });

vorpal
  .command('report', 'generate your report')
  .action(function(args, callback) {
    const github = new Github({
      token : githubrc.token,
      auth  : 'oauth2'
    });
    const user = github.getUser();
    primisify(user.events)(githubrc.username, githubrc.org, function(results) {
      console.log(`fetched ${results.length} events, continuing...`);
      const last = results.slice(-1)[0];
      return moment().startOf('isoWeek').isBefore(last.created_at);
    })
      .then(function(events) {
        fs.writeFileSync('./events.json', JSON.stringify(events, null, 2), 'utf8');
        analysis(events);
      })
      .then(callback)
      .catch(function(error) {
        self.log(err);
        throw err;
      });
  });

function analysis(events) {
  let users = _.groupBy(events, (evt) => evt.actor.login);
  let summary = [];
  for (let name in users) {
    let total = 0;
    let userTable = [
      ['type', 'repo', 'value', 'description'].join(','),
    ];
    for (let evt of users[name]) {
      const val = Event.eval(evt.type);
      userTable.push([
        evt.type, 
        evt.repo.name,
        val,
        Event.describe(evt).replace(/["']/g, ''),
      ].join(','));
      total += val;
    }
    summary.push({
      name, total,
    });
    console.log('user: ', name);
    console.log(userTable.join('\n'), '\n');
  }
  // print
  let table = new Table();
  table.push(['', 'name', 'contributes']);
  table.push.apply(table, _.sortBy(summary, 'total').reverse().map((item, index) => {
    return [index + 1, item.name, item.total];
  }));
  console.log(thisWeek() + ' Developers Ranking');
  console.log(table.toString(), '\n');
}

function thisWeek() {
  var now = moment();
  return [
    now.startOf('isoWeek').format('YY/MM/DD'),
    now.endOf('isoWeek').format('YY/MM/DD')
  ].join(' - ');
}

vorpal
  .delimiter('github-weekly-report>')
  .parse(process.argv)
  .show();
