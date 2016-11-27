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
    cnic:
    {
      type: 'integer',
       defaultsTo:'null'
    },

    v_id: {
      type: 'string',
      unique: true
    },

    f_status:
    {
      type:'Boolean',
      defaultsTo:false
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

    in_order:
    {
      type:'Boolean',
      defaultsTo:false
    },

    location:
    {
      type:'string',
      defaultsTo:'no location right now'
    },

    applied:
    {
     type:'Boolean',
      defaultsTo:false
    },

    account_secret:
    {
      type:'string',
      defaultsTo:'homefoodiesdgac'
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

