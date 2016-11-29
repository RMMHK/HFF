/**
 * AckController
 *
 * @description :: Server-side logic for managing acks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  ackJob:function (req,res) {
    {
      var params= req.body;
      Pending.update({id:params.order},{acked_by_guy:true}).then(function (data,err) {})
    }

  }

};

