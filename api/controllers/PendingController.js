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

    geo_coder.reverseGeocode(33.7120818,73.070842,function (err,location) {
      if(location)
      {
        for(i=0;i<2;i++)
        {
          console.log(location)
          var array = location.result
          console.log(array)
          var jsonArray = JSON.stringify(array)
          console.log(jsonArray.length)


        }


    Pending.create({customer_token:cus_token,provider_id:provider_id,ordered_dish:ordered_dish,ordered_quantity:ordered_quantity,ordered_bill:ordered_bill,order_unit:ordered_unit}).then(function (tempOrder,err)
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
