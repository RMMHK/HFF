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

     //parameters NAME , DECRIPTION, PRICE , ESHOP ID...//food type
     HashTable.findOne({foodTypeName:params.foodTypeName}).then(function(data,err)
       {
         Fooditem.create({name:params.name,description:params.description,price:params.price,type_of_food:params.foodTypeName,eshop_id:params.eshop_id,selling_unit:params.selling_unit,typeOf:data.foodTypeId,eshop:params.eshop_id}).then(function (data,err) {

           if (data)
           {
             EShop.findOne({id:params.eshop_id}).populate('ES_items').then(function (items,err) {

               if (items)
                 res.json({status:1 ,new_item:data,items:items.ES_items})//response

               if(err)
               {
                 res.json({status:0})//response
               }
             })
           }
           else
           {
             res.json({status:0})//response
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
         console.log(data[0].eshop)

         EShop.findOne({id:data[0].eshop}).populate('ES_items').then(function (items,err) {

           if (items)
             res.json({status:1,item_status:data[0].status,items:items.ES_items})

           if(err)
           {
             res.json({status:0})
           }
         })

       }

       else if (err)
       {
         res.json({status:0})
       }

     })

   },


  editItem:function (req,res,next) {
    var params = req.body
    console.log(params)


    Fooditem.update({id:params.id},{name:params.name,description:params.description,price:params.price}).then(function (data,err) {

      if (data)
      {
        EShop.findOne({id:data[0].eshop}).populate('ES_items').then(function (items,err) {

          if (items)
            res.json({status:1,the_item:data[0],items:items.ES_items})

          if(err)
          {
            res.json({status:0})
          }
        })


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
      console.log(data[0])
      if (data[0])
      {
        EShop.findOne({id:data[0].eshop}).populate('ES_items').then(function (items,err) {

          if (items)
            res.json({status:1,the_item:data[0].id,items:items.ES_items})

          if(err)
          {
            res.json({status:0})
          }
        })
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

      Fooditem.find({type_of_food:params.foodTypeName,status:true}).then(function (items_array,err) {


        if (items_array.length!=0)
        {

          for(i=0;i<items_array.length;i++)
          {

            EShop.findOne({id:items_array[i].eshop_id}).then(function (eshop,err)
            {

              if(eshop)
                        {
                          var index=i-1;
                       //   console.log(eshop)
                          if (eshop.ES_STATUS ==true && eshop.ES_BLOCK == false)
                          {
                            console.log(i)
                            console.log(items_array[index].name)
                            console.log(items_array[index].description)

                            result.push(
                              {
                                "name": items_array[index].name,
                                "description": items_array[i].description,
                                "price": items_array[i].price,
                                "location": items_array[i].eshop.ES_LOCATION,
                                "taste": items_array[i].taste_meter,
                                "quality": items_array[i].quality_meter,
                                "served": items_array[i].served,
                                "status": "available"
                              })
                              console.log(result)
                          }

                        }

            if (err)
              console.log(err)



            })
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

