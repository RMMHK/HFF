/**
 * Created by RMMHK on 10/24/2016.
 */


module.exports= {

  attributes: {

     dish_type: {
      type: 'string',
      require:true,
      unique:true
    },

    joint: {
      model: 'dishname'
    }
  }
}
