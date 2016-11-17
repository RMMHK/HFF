/**
 * Fooditem.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    status: {
      type:'boolean',
      defaultsTo:false
    },
    name:
    {
      type:'string'
    },
    description:
    {
    type:'string'
    },

    price:
    {
      type:'integer'
    },
    type_of_food:
    {
      type:'string'
    },
    quality_meter:
    {
      type:'integer',
      defaultsTo: 0
    },

    taste_meter:
    {
      type:'integer',
      defaultsTo: 0
    },

    selling_unit:
    {
      type:'string',

    },

    served:
    {
      type:'integer',
      defaultsTo: 0
    },

    least_order:
    {
      type:'integer',        /* needs to be setup in front end and back end also */
      defaultsTo:1
    },
    max_order:
    {
      type:'integer',
      defaultsTo:5
    },

    typeOf:{
      model:'Dishtype'
    },

    eshop:
    {
      model:'EShop'
    }
  }
};

