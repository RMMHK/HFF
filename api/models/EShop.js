/**
 * Created by RMMHK on 9/4/2016.
 */
module.exports= {


  attributes: {

    ES_NAME: {
      type: 'string',
      defaultsTo:'Food Provider'
    },
    ES_OWNER_REAL_ID:
    {
      type:'string'
    },
    ES_REAL:
    {
      type:'string',
      defaultsTo:'false'
    },

    ES_STATUS: {
      type: 'boolean',
      defaultsTo: 'false'
    },
    ES_REG_DATE: {
      type: 'date'
    },
    ES_LOCATION: {
      type: 'string',
      defaultsTo:'need to fix'
    },

    ES_BLOCK: {
      type: 'boolean',
      defaultsTo: 'false'
    },

    ES_SUBSCRIBERS:{
      type:'string',
      defaultsTo:'N/A'
    },
/*
   Owner: {

      model:'user',
     unique:true
    }*/

   ES_items:
   {
     collection:'Fooditem',
     via:'eshop'
   }

  }
};
