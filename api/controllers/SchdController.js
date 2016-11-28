/**
 * SchdController
 *
 * @description :: Server-side logic for managing schds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  start: function (req,res) {
    var schedule = require('node-schedule')
 //   console.log('lala!');
    let startTime = new Date(Date.now() + 5000);
  //  let endTime = new Date(now.getTime() + 5000);
    var j = schedule.scheduleJob({ start: startTime, rule: '*/1 * * * * *' }, function(){
      console.log('Time for tea!');
    });

  }
};

