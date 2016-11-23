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
    var sector_array =[]
    var results =[]
    var street;
    var sector;


    Fooditem.findOne({id:item_id}).populate('eshop').then(function (data,err) {

      res.json({data})

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


function hello () {
  console.log("hi i am executed");
return ;}


function  hi() {
  console.log("hi i am executed now")
}

function  hey() {
  console.log("ITNI BADBOOO")
}
