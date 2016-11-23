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
  temp_order: function (req, res) {

    var params = req.body;


    var cus_lat= body.lat;
    var cus_long= body.long;
    var ordered_dish= body.ordered_dish;
    var cus_token= body.cus_token;
    var provider_id = body.ordered_provider;
    var item_id = body.ordered_item_id;
    var ordered_bill = body.ordered_price;
    var ordered_quantity= body.ordered_quantity
    var ordered_unit=body.ordered_unit

    //check status of the shop and item
    //make request to provider and wait

    Pending.create({customer_token:cus_token,provider_id:provider_id,ordered_dish:ordered_dish,ordered_quantity:ordered_quantity,ordered_bill:ordered_bill,order_unit:ordered_unit}).then(function (tempOrder,err)
    {

    if(tempOrder)
    {
      //PUSH to provider

      console.log(tempOrder);
    }

    })




var geo_coder= require("geocoder");

    geo_coder.reverseGeocode(33.7120818,73.070842,function (err,data) {
      if(data)
      {
        console.log(data)
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
  console.log("hi i am executed");}


function  hi() {
  console.log("hi i am executed now")
}

function  hey() {
  console.log("ITNI BADBOOO")
}
