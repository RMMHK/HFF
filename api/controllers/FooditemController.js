/**
 * FooditemController
 *
 * @description :: Server-side logic for managing fooditems
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



   made:function (req,res,next) {

     var params = req.body

     Fooditem.create({name:params.name,status:params.status}).then(function (data,err) {

       if (data)
       {
         res.json({item:data})
       }
     else
       {
         res.json({error:err})
       }
     })
   },



   update_item_status:function (req,res,next) {
     var params = req.body
     Fooditem.update({id:params.id},{status:params.status}).then(function (data,err) {

       if (data)
       {
         res.json({success:data})
       }

       else
       {
         res.json({error:err})
       }

     })

   },




  search_item:function (req,res,next) {
    var params = req.body
    Fooditem.find({name:params.name,status:params.status}).then(function (data,err) {

      if (data)
      {
        res.json({success:data})
      }

      else
      {
        res.json({error:err})
      }

    })

  },



};

