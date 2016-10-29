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
    var result=[]
    var items={}
      Fooditem.find({name:req.foodTypeName}).then(function (data,err) {

        if (data) {
          console.log(data)
          for (var i = 0; i < data.length; i++) {
            if (data[i].eshop.ES_STATUS == "true" && data[i].eshop.ES_BLOCK == "false") {
              result.push(
                {
                  "name": data[i].name,
                  "description": data[i].description,
                  "price": data[i].price,
                  "location": data[i].eshop.ES_LOCATION,
                  "taste": data[i].taste_meter,
                  "quality": data[i].quality_meter,
                  "served": data[i].served,
                  "status": "available"

                }
              )
              items.item=result
            }

          }
          if (items != "")

            res.json({result:items});

          else
            res.json({response: "no result"})
        }
        else
        {
          res.json({error:err})
        }
      })
  },



};
/*
HashTable.findOne({foodTypeName:params.foodTypeName}).then(function(data,err)
{
  Dishtype.find({id:data.foodTypeId}).populate('fooditems').then(function (data,err) {

    if (data)
    {
      res.json({item:data})
    }
    else
    {
      res.json({error:err})
    }
  })})*/
