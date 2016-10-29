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

     HashTable.findOne({foodTypeName:params.foodTypeName}).then(function(data,err)
       {
         Fooditem.create({name:params.foodTypeName,description:params.description,price:params.price,typeOf:data.foodTypeId,eshop:params.eshopId}).then(function (data,err) {

           if (data)
           {
             res.json({item:data})
           }
           else
           {
             res.json({error:err})
           }
         })})

   },



   updateItemStatus:function (req,res,next) {
     var params = req.body
     console.log(params)

     Fooditem.update({id:params.id},{status:params.status}).then(function (err,data) {

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

    HashTable.findOne({foodTypeName:params.foodTypeName}).then(function(data,err)
    {
      DishType.find({id:data.foodTypeId}).populate('fooditems').then(function (data,err) {

        if (data)
        {
          res.json({item:data})
        }
        else
        {
          res.json({error:err})
        }
      })})
  },



};

