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

    served:
    {
      type:'integer',
      defaultsTo: 0
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

