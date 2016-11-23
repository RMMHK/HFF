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
    var ordered_dish= params.ordered_dish;
    var cus_token= params.cus_token;
    var provider_id = params.ordered_provider;
    var item_id = params.ordered_item_id;
    var ordered_bill = params.ordered_price;
    var ordered_quantity= params.ordered_quantity
    var ordered_unit=params.ordered_unit
    console.log(params)
    //check status of the shop and item
    //make request to provider and wait
    var geo_coder= require("geocoder");
    var raw_location =[]
    var results =[]
    var street;
    var sector;
    geo_coder.reverseGeocode(33.7120818,73.070842,function (err,location) {

      if(location) {

        results=location.results;


        for(i=0;i<2;i++)
        {
          var obj = results[i];
           if(i=0)
           {
             street = obj.formatted_address.toString();
             console.log(street);
           }

           sector=obj
        }
        res.json({sector})
        /*  Pending.create({customer_token:cus_token,provider_id:provider_id,ordered_dish:ordered_dish,ordered_quantity:ordered_quantity,ordered_bill:ordered_bill,order_unit:ordered_unit}).then(function (tempOrder,err)
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



         var delay = 10000

         hello();
         setTimeout(hi,delay)
         setTimeout(hey,delay+1)

         }
         */
      }})}
};


function hello () {
  console.log("hi i am executed");
return ;}


function  hi() {
  console.log("hi i am executed now")
}

function  hey() {
  console.log("ITNI BADBOOO")
}
