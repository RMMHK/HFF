/**
 * UpdateController
 *
 * @description :: Server-side logic for managing updates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  send:function (req,res,next) {

    //take in put from dishname model// populate it and prepare an appropriate output..
    Dishname.find({}).populate('Types').then(function(data,err)
    {
      if (data)  // for preparing dishname file..
      {
        var dish_names=[]

        var container=[]
        var dish_types=[]
        var data_length= data.length;

        for(i=0;i<data_length;i++)
        {

            dish_names.push(

              data[i].DishName
            )
            }//dishnames working fine
      for(i=0;i<data.length;i++)

      {
        console.log(data_length)
        var dish_name=  data[i].DishName
      // console.log(dish_types)
        for(j=0;j<data[i].Types.length;j++)
        {
          dish_types.push(
             data[i].Types[j].single_name
          )


        }

        container.push({

          dishname:dish_name,dishType:dish_types
        })
        dish_types=[]
      }

      res.json({list:container})
      }


    })

  }


};

