/**
 * FooditemController
 *
 * @description :: Server-side logic for managing fooditems
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


//create food item function
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


  //fucntion of updating item status
  //parameter food item id and status
   updateItemStatus:function (req,res,next) {
     var params = req.body
     console.log(params)

     Fooditem.update({id:params.id},{status:params.status}).then(function (data,err) {

       if (data)
       {
         res.json({success:data})
       }

       else if (err)
       {
         res.json({error:err})
       }

     })

   },


  editItem:function (req,res,next) {
    var params = req.body
    console.log(params)


    Fooditem.update({id:params.id},{description:params.description,price:params.price}).then(function (data,err) {

      if (data)
      {
        res.json({status:1,item:data})
      }

      else if(err)
      {
        res.json({status:0})
      }

    })

  },

  deleteItem:function (req,res,next) {
    var params = req.body
    console.log(params)


    Fooditem.destroy({id:params.id}).then(function (data,err) {

      if (data)
      {
        res.json({status:1})
      }

      else if(err)
      {
        res.json({status:0})
      }

    })

  },




//FUNCTION OF SEARCHING
  //parameter foodName
  searchItem:function (req,res,next) {
    var params = req.body
    console.log(params)
    var result=[]
    var items={}
      Fooditem.find({name:params.foodTypeName,status:true}).populate('eshop').then(function (data,err) {
        if (data) {
          console.log(data)
          for(var i = 0; i < data.length; i++) {

            console.log(data[i])
            console.log(data[i].eshop.ES_STATUS)

             if(data[i].eshop.ES_STATUS ==true && data[i].eshop.ES_BLOCK == false) {

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
               console.log(result)
             }

          }
          if (result.length!=0)
            res.json({result:result});

          else
            res.json({result: 0})
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
