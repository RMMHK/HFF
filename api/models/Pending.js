/**
 * Pending.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    customer_token: {
      type: 'string'
    },

    provider_id: {
      type: 'string'

    },

    customer_location: {
      type: 'string',
      defaultsTo:"null"

    },

    ordered_dish_type:
    {
      type:'string',
      defaultsTo:"no type yet"
    },
    ordered_dish: {
      type: 'string',
      defaultsTo:"no dish"
    },

    ordered_quantity: {
      type: 'string',
      defaultsTo:"0"
    },
    ordered_bill: {
      type: 'string',
      defaultsTo: "0"
    },

    ordered_unit: {
      type: 'string',
      defaultsTo: "0"
    },

    provider_response: {
      type: 'integer',
      defaultsTo: -1 // means not responded  //0 for cancelled  //1 for accepted
    },

    guy_name: {
      type: 'string',
      defaultsTo: 'not assigned'
    },

    guy_cell: {
      type: 'string',
      defaultsTo: 'not available'
    },


    guy_status: {
      type: 'string',
      defaultsTo: 'not status yet'
    },

  }

};

