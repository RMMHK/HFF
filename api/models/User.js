/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {

    //USER MODEL
  	name: {
  		type :'string',
  		required: true

  	},

  	cell: {
  		type :'string',
  		required: true,
  		unique: true
  	},

     email: {
     	type:'string',
     	email: true,
     	required: true,
     	unique: true
     },
      cnic://ID card
     {
     	type:'integer'
     },

     f_status://fraud status
     {
     	type:'boolean'
     },
     f_warnings://fraud warnings

     {
     	type:'integer'
     },

      location://location through GPS
    {
    	type:'string',
      defaultsTo:'null'
    },

    v_id:
    {
      type:'string',
      unique:true
    },

    token:
    {
      type:'string',
      defaultsTo:'N/A'
    },
    eshop_id:
    {
      type: 'string',
      defaultsTo:'null'
    },

    fp_orders:
    {
      collection:'Pending',
      via:'provider'
    },


  /*  account_secret:
    {
      required:true,//account secret needs to be connected
      type:'string'
    },*/

EShop:{
  model:'EShop',
}

 /* toJSON: function() {

var obj = this.toObject();

      }*/
  }
};

