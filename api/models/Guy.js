/**
 * Guy.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },

    cell: {
      type: 'string',
      required: true,
      unique: true
    },

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },
    cnic://ID card
    {
      type: 'integer'
    },

    v_id: {
      type: 'string',
      unique: true
    },

    token: {
      type: 'string',
      defaultsTo: 'N/A'
    },

    available:
    {
      type:'Boolean',
      defaultsTo:true
    },


    location:
    {
      type:'string',
      defaultsTo:'no location right now'
    },


    assigned_order:
    {
      type:'string', //id of the pending order who's job has beeen accepted by this guy
      defaultsTo:'no order assigned'
    },

    completed_orders:
    {
      collection:'Order',
      via:'guy'
    }


  }


};

