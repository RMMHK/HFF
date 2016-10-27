/**
 * FooditemController
 *
 * @description :: Server-side logic for managing fooditems
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



   create:function (req,res,next) {

     Fooditem.create({name:req.name,status:req.status}).then(function (data,err) {

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

     Fooditem.update({id:req.id},{status:req.status}).then(function (data,err) {

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

    Fooditem.find({name:req.name,status:req.status}).then(function (data,err) {

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

