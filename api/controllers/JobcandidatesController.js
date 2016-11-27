/**
 * JobcandidatesController
 *
 * @description :: Server-side logic for managing jobcandidates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  guy_id:{
    type:'string',
    defaultsTo:'null'
  },

  pending_order_id:
  {
    type:'string',
    defaultsTo:'null'
  },
  candidates:{
    model:'Pending'
  }

};

