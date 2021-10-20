var copydir = require('copy-dir');
var path = require('path');
var chalk = require('chalk');

module.exports = function() {

  copydir.sync(path.resolve(__dirname, '../public'), path.resolve(__dirname, '../dist'), {
    utimes: true,
    mode: true,
    cover: true
  });
  
  console.log(chalk.cyan('  Public files moved.\n'))

}