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

var geo_coder= require("geocoder");

    geo_coder.reverseGeocode(33.7120818,73.070842,function (err,data) {
      if(data)
      {
        console.log(data)
      }
      else
        console.log(err)
    }



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
