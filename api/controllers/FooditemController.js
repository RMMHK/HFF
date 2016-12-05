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


search:function (req,res,next) {




    var params = req.body
   console.log(params)
  var result = []
  var eshop=[]
  var obj;
  var km;

 /* get_distance(parseFloat(params.shop_lat),parseFloat(params.shop_long),parseFloat(params.cus_lat),parseFloat(params.cus_long),function (data) {

  km = data;
  console.log(km)
})*/

  Fooditem.find({type_of_food:params.dish,status:true}).populate('eshop').then(function (items,err) {



    if(items)
    {

      var cus_loc;

      get_customer_location(parseFloat(params.lat),parseFloat(params.long),function (cusloc) {
        cus_loc=cusloc
        console.log(cus_loc)

      })


      for(index=0;index<items.length;index++)
      {
              if (items[index].eshop.ES_STATUS == true && items[index].eshop.ES_BLOCK == false&&params.quick=="false")
            {

              var km;
              get_distance(parseFloat(items[index].eshop.ES_LAT),parseFloat(items[index].eshop.ES_LONG),parseFloat(params.lat),parseFloat(params.long),function(distance)
              {
                km = distance;
              })

              var obj =
              {
                name: items[index].name,
                description: items[index].description,
                price: items[index].price.toString(),
                location: km,
                cusLoc: cus_loc+" ",
                hhs:'oye',
                taste: items[index].taste_meter.toString(),
                quality: items[index].quality_meter.toString(),
                served: items[index].served.toString(),
                least_order: items[index].least_order.toString(),
                selling_unit: items[index].selling_unit,
                token:items[index].eshop.ES_OWNER_REAL_ID,

                id:items[index].id,
                status: "available"
              }
              if((items[index].served)<=20)
              {
                if(items[index].eshop.ES_REAL=="true") {
                  result.push({
                    real:"true",
                    tag: "new",
                    item: JSON.stringify(obj)
                  })
                }
                else
                {
                  result.push({
                    real:"false",
                    tag: "new",
                    item: JSON.stringify(obj)
                  })
                }
              }
              else
              {
                if(items[index].eshop.ES_REAL=="true") {
                  result.push({
                    real:"true",
                    tag: "rated",
                    item: JSON.stringify(obj)
                  })
                }
                else {
                  result.push({
                    real:"false",
                    tag: "rated",
                    item: JSON.stringify(obj)
                  })
                }
              }
              eshop.push({
                shop_id:items[index].eshop_id,
                real:items[index].eshop.ES_REAL

              })


            }

            else if(items[index].eshop.ES_STATUS == true && items[index].eshop.ES_BLOCK == false&&params.quick=="true") {

                var km;
                get_distance(parseFloat(items[index].eshop.ES_LAT), parseFloat(items[index].eshop.ES_LONG), parseFloat(params.lat), parseFloat(params.long), function (distance) {
                  km = distance;
                })

                if(km<=params.radius)
                {
                var obj =
                {
                  name: items[index].name,
                  description: items[index].description,
                  price: items[index].price.toString(),
                  location: km,
                  cusLoc:cus_loc,
                  taste: items[index].taste_meter.toString(),
                  quality: items[index].quality_meter.toString(),
                  served: items[index].served.toString(),
                  least_order: items[index].least_order.toString(),
                  selling_unit: items[index].selling_unit,
                  token: items[index].eshop.ES_OWNER_REAL_ID,
                  id: items[index].id,
                  status: "available"
                }
                if ((items[index].served) <= 20) {
                  if (items[index].eshop.ES_REAL == "true") {
                    result.push({
                      real: "true",
                      tag: "new",
                      item: JSON.stringify(obj)
                    })
                  }
                  else {
                    result.push({
                      real: "false",
                      tag: "new",
                      item: JSON.stringify(obj)
                    })
                  }
                }
                else {
                  if (items[index].eshop.ES_REAL == "true") {
                    result.push({
                      real: "true",
                      tag: "rated",
                      item: JSON.stringify(obj)
                    })
                  }
                  else {
                    result.push({
                      real: "false",
                      tag: "rated",
                      item: JSON.stringify(obj)
                    })
                  }
                }
                eshop.push({
                  shop_id: items[index].eshop_id,
                  real: items[index].eshop.ES_REAL

                })
                }
            }
      }
      res.json({items:result,shops:eshop})
    }

  })


},

};

function get_distance(shop_lat,shop_long,cus_lat,cus_long,callback) {
  var geodist = require('geodist')

  var shop = {lat:shop_lat,long:shop_long}
  var customer={lat:cus_lat,long:cus_long}

 var distance = geodist(shop,customer,{unit:'km'})
  return callback(distance)
}


function get_customer_location (lat,long,callback) {
  var address
  var error= "N/A"
  var geo_coder= require("geocoder");

  geo_coder.reverseGeocode(lat,long,function (err,location) {

    if(location) {

      results = location.results;

      for (i = 0; i < 2; i++) {
        var obj = results[i];
        if (i == 0) {
          street = obj.formatted_address

        }
        if (i == 1) {
          sector_array = obj.address_components
          sector = sector_array[0].long_name
        }
      }
      address = sector+","+street;
      console.log(address+"")

      return callback(address,"");
    }

    if (err)
    {
      return callback(address,error)
    }
  })

}

//FUNCTION OF SEARCHING
//parameter foodName
/*  searchItem:function (req,res,next) {
 var params = req.body
 console.log(params)

 var items=[]
 var index=0;
 Fooditem.find({type_of_food:params.foodTypeName,status:true}).then(function (items_array,err) {


 if (items_array.length!=0)
 {
 var result=[]
 for(index=0;index<items_array.length;index++)
 {
 EShop.findOne({id:items_array[index].eshop_id}).then(function (eshop,err) {

 if (eshop) {

 index = index - 1;
 console.log(eshop)
 if (eshop.ES_STATUS == true && eshop.ES_BLOCK == false) {
 here gps coordinates will be compared
 /*    var obj =

 {
 name: items_array[index].name,
 description: items_array[index].description,
 price: items_array[index].price.toString(),
 location: items_array[index].eshop.ES_LOCATION,
 taste: items_array[index].taste_meter.toString(),
 quality: items_array[index].quality_meter.toString(),
 served: items_array[index].served.toString(),
 least_order: items_array[index].least_order.toString(),
 selling_unit: items_array[index].selling_unit,
 id: items_array[index].id,
 status: "available"
 }
 var item_json = JSON.stringify(obj)

 result.push({item_json})
 console.log(result)

 }
 }


 if (err)
 console.log(err)


 })}
 res.json({result:result});





 }

 else
 {
 res.json({error:err})
 }})},

 */

//  res.json({result: 0})
