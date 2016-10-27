/**
 * FooditemController
 *
 * @description :: Server-side logic for managing fooditems
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



   made:function (req,res,next) {

     var params = req.body

     console.log(params)

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



   updateItemStatus:function (req,res,next) {
     var params = req.body
     console.log(params)

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




  searchItem:function (req,res,next) {
    var params = req.body
    console.log(params)

    Fooditem.find({name:params.name, status:params.status}).then(function (data,err) {

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

