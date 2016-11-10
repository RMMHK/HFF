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
        var data_length= data.length;

        for(i=0;i<data_length;i++)
        {

            dish_names.push(

              data[i].DishName
            )



            }

            res.json({disnames:dish_names})
      }


    })

  }


};

