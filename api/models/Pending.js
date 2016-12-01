/**
 * Pending.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

   item_id:{
     type:'string',
     defaultsTo:null
   },

    customer_id: {
      type: 'string'
    },


    provider_id: {
      type: 'string'
    },

    guy_id:
    {
      type:'string',
      defaultsTo:-1

    },

    customer_cell:
    {
      type:'string',
      defaultsTo:"null"
    },

    provider_cell:
    {
      type:'string',
      defaultsTo:"null"
    },

    customer_location: {
      type: 'string',
      defaultsTo:"null"

    },

    provider_location:
    {
      type:'string',
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
      defaultsTo: '-1'
    },

    guy_cell: {
      type: 'string',
      defaultsTo: '-1'  //used to check in front end either the guy assigned or not, if not the show order terminated due to no guy available
    },


    guy_marked_status:
    {
      type: 'string',
      defaultsTo: '-1' //o for cancel +1 for delivered
    },

    guy_depart_status:
    {
      type:'string',
      defaultsTO:'-1'//"+1 when acked
    },

    acked_by_customer:
    {
      type:'Boolean',
      defaultsTo:false
    },

    acked_by_provider:
    {
      type:'Boolean',
      defaultsTo:false
    },

    acked_by_guy:
    {
      type:'Boolean',
      defaultsTo:false
    },

    lock:{
      type:'Boolean',
      defaultsTo:true
    },

   ack_scheduler_allowed:
    {
      type:'Boolean',
      defaultsTo:false
    },
    clean_scheduler_allowed:
    {
      type:'Boolean',
      defaultsTo:false
    },

    apply_to:
    {
      type:'Boolean',
      defaultsTo:true
    },
    applicants:
    {
      collection:'jobcandidates',
      via:'candidates'
    },

    guy:
    {
      model:'guy'
    },
    provider:
    {
      model:'user'
    },
    customer:
    {
      model:'customer'
    },

    deleted_by_customer:{

      type:'Boolean',
      defaultsTo:false
    },
    deleted_by_provider:{

      type:'Boolean',
      defaultsTo:false
    },
    deleted_by_guy:{

      type:'Boolean',
      defaultsTo:false
    },

    cancelled_by_provider:
    {
      type:'Boolean',
      defaultsTo:false
    },
    cancelled_by_customer:
    {
      type:'Boolean',
      defaultsTo:false
    },


    fraud_by_customer:
    {
      type:"Boolean",
      defaultsTo:false,
    },

    fraud_by_provider:
    {
      type:"Boolean",
      defaultsTo:false,

    }

  }





};

