/**
 * UpdateController
 *
 * @description :: Server-side logic for managing updates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  send:function (req,res,next) {

    //take in put from dishname model// populate it and prepare an appropriate output..
    Dishname.find({}).then(function(data,err)
    {
      res.json({data});
    })

  }
  

};

