/**
 * Jobcandidates.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    guy_id:
    {
      type:'string',
      defaultsTo:'null'
    },
    guy_token: {
      type: 'string',
      defaultsTo: 'null'
    },

    pending_order_id: {
      type: 'string',
      defaultsTo: 'null'
    },

    candidates: {
      model: 'Pending'
    }
  }
};


