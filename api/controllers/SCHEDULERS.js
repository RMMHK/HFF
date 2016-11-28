/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  start: function (req,res) {
    var schedule = require('node-schedule')

    var j = schedule.scheduleJob('5 * * * *', function () {
      console.log('i am executed!')
    })

  }
















};

