/**
 * Dishname.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    DishName: {
      type: 'string',
      required:true,
      unique:true
    },

    order_unit:{
      type: 'string',
      required:true
    },

    Types:{
      collection:'Dishtype',
      via:'joint'
    }
  }
};

