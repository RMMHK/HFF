/**
 * Created by RMMHK on 10/24/2016.
 */

module.exports= {

  attributes: {

    dish_name: {
      type: 'string',
      require:true,
      unique:true
    },

    Types:{
      collection:'dishtype',
      via:'joint'
    }
  }

}
