/**
 * PendingController
 *
 * @description :: Server-side logic for managing pendings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



  /**
   * `PendingController.order()`
   */
  order: function (req, res) {

    var params = req.body;

    var cus_lat= params.lat;
    var cus_long= params.long;
    var cus_token= params.cus_token;
    var provider_id = params.ordered_provider;
    var item_id = params.ordered_item_id;
    var ordered_bill = params.ordered_price;
    var ordered_quantity= params.ordered_quantity
    console.log(params)
    //check status of the shop and item
    //make request to provider and wait

    var sector_array =[]
    var results =[]
    var street;
    var sector;


    Fooditem.findOne({id:item_id}).populate('eshop').then(function (data,f_err) {

      if(data!=""&&data!=undefined&&data!=null)
      {
         if(data.status!=false&&data.eshop.ES_STATUS!=false)
         {
            try {
              get_customer_location(parseFloat(cus_lat), parseFloat(cus_long), function (location, l_error) {

                if(location)
                {
                  Pending.create({customer_token:cus_token,provider_id:provider_id,ordered_dish_type:data.type_of_food,ordered_dish:data.name,ordered_quantity:ordered_quantity,ordered_bill:ordered_bill,order_unit:data.selling_unit,customer_location:location}).then(function (tempOrder,o_err)
                  {
                    if(tempOrder)
                    {


                      User.findOne({id:provider_id}).then(function (provider,p_err) {

                        if(provider!=null&&provider!=undefined&&provider!="")
                        {


                          initiate_order_request(provider.token,tempOrder.id, tempOrder.ordered_dish,tempOrder.ordered_dish_type,tempOrder.ordered_quantity,tempOrder.order_unit,tempOrder.ordered_bill, function (initiated,err) {

                            if(initiated)
                              res.json({initiated})
                            else if(err)
                              res.json({err})


                          })
                          //function to provider having arguments of token of provider and id of the temp order
                          //wait for some time then execute the function of the status of the order approved or not
                          //check for the responses

                        }

                        else if(p_err)
                        {
                          res.json({exists:0}) //0 is for error
                        }

                        else
                        {
                          res.json({exists:-1})//-1 is for not existing on the system any more
                        }



                      })




                    }

                    else if (o_err)
                    {
                        res.json({order_creation:-1})
                    }

                  })

                }

                else if (l_error)
                {
                  res.json({location:-1})
                }

              });
            }catch (exception){
              //response here
              res.json({location:-1})

            }




         }

         else
         {
           res.json({item_online:-1})
         }

      }

      else if(data==""||data==undefined||data==null)
      {
        res.json({item_exists:-1})
      }
        else if (f_err)
      {
        res.json({item_exists:-1})
      }
    })

/*
    geo_coder.reverseGeocode(33.7120818,73.070842,function (err,location) {

      if(location) {

        results=location.results;

        for(i=0;i<2;i++)
        {
          var obj = results[i];
           if(i==0)
           {
             street = obj.formatted_address

           }

             if(i==1) {
               sector_array = obj.address_components
                sector= sector_array[0].long_name
             }
        }
           var customer_location = sector+","+street;
          Pending.create({customer_token:cus_token,provider_id:provider_id,ordered_dish:ordered_dish,ordered_quantity:ordered_quantity,ordered_bill:ordered_bill,order_unit:ordered_unit,customer_location:customer_address}).then(function (tempOrder,err)
         {

         if(tempOrder)
         {
         //PUSH to provider

         console.log(tempOrder);
         }

         })
         }
         else
         console.log(err)
         })

        hello();
      //   setTimeout(hi,delay)
*/
         }
};


function get_customer_location (lat,long,callback) {
  var address
  var error= "N/A"
  var geo_coder= require("geocoder");

  geo_coder.reverseGeocode(lat,long,function (err,location) {

    if(location) {
    console.log(location)
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

function initiate_order_request(provider_token,temp_order_id,dish,type,quantity,unit,bill,callback) {
  //notification system to send provider
  var FCM = require('fcm-node');
  var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
  var fcm = new FCM(serverKey);
  var token = provider_token

  var ordered_dish_name = dish;
  var ordered_dish_type;
  var ordered_dish_quantity=quantity;
  var ordered_dish_unit=unit;
  var ordered_dish_bill;
  var ordered_order_id;

  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: token,


    notification: {
      title: "Order of " + ordered_dish_name,
      body: ordered_dish_quantity+" "+ordered_dish_unit

    },

    data: {  //you can send only notification or only data(or include both)
      collapse_key: " ",
      temp_order_id: ordered_order_id,
    }};


    fcm.send(message, function(err, response){
    if (err) {

      console.log(err)
      console.log("Something has gone wrong!");
      return callback("",-1)
    } else if(response)
    {
        return callback(1,"")
    }
  });

}
