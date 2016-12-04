/**
 * AckController
 *
 * @description :: Server-side logic for managing acks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  ackJob: function (req, res) {
    {
      var params = req.body;
      Pending.update({id: params.order}, {acked_by_guy: true}).then(function (data, err) {

      })
    }


  },

  ackCustomer: function (req, res) {
    {
      var params = req.body;
      console.log(params)
      Pending.update({id: params.order}, {acked_by_customer: true}).then(function (data, err) {
        console.log(err)
      })
    }

  },


  ackProvider: function (req, res) {
    {
      var params = req.body;
      console.log(params)
      Pending.update({id: params.order}, {acked_by_provider: true}).then(function (data, err) {
        console.log(err)
      })
    }

  }
}

