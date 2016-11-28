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

    var cus_lat = params.lat;
    var cus_long = params.long;
    var cus_token = params.cus_token;
    var provider_id = params.ordered_provider;
    var item_id = params.ordered_item_id;
    var ordered_bill = params.ordered_price;
    var ordered_quantity = params.quantity
    var customer_id = params.cus_id
    console.log(params)
    //check status of the shop and item
    //make request to provider and wait
    console.log(params)
    var sector_array = []
    var results = []
    var street;
    var sector;


    Fooditem.findOne({id: item_id}).populate('eshop').then(function (data, f_err) {

      if (data != "" && data != undefined && data != null) {
        if (data.status != false && data.eshop.ES_STATUS != false) {
          try {
            get_customer_location(parseFloat(cus_lat), parseFloat(cus_long), function (location, l_error) {

              if (location) {
                Pending.create({
                  customer_id: customer_id,
                  provider_id: provider_id,
                  provider_location: data.eshop.ES_LOCATION,
                  ordered_dish_type: data.type_of_food,
                  ordered_dish: data.name,
                  ordered_quantity: params.quantity,
                  ordered_bill: params.ordered_price,
                  ordered_unit: data.selling_unit,
                  customer_location: location
                }).then(function (tempOrder, o_err) {
                  if (tempOrder) {


                    User.findOne({id: provider_id}).populate('EShop').then(function (provider, p_err) {

                      if (provider != null && provider != undefined && provider != "") {


                        initiate_order_request(provider.token, tempOrder.id, tempOrder.ordered_dish, tempOrder.ordered_dish_type, tempOrder.ordered_quantity, tempOrder.ordered_unit, tempOrder.ordered_bill, function (initiated, err) {

                          if (initiated) {

                            //execute request responder
                            setTimeout(function () {

                              Pending.update({id: tempOrder.id}, {lock: false}).then(function (order, err) {

                                if (order[0].provider_response == 1) {
                                  res.json({status: "+1"})


                                  Customer.findOne({id: tempOrder.customer_id}).then(function (cus, err) {

                                    if (cus) {
                                      Pending.update({id: tempOrder.id}, {
                                        customer_cell: cus.cell,
                                        provider_cell: provider.cell
                                      }).then(function (success, err) {

                                        if (success[0]) {


                                           Guy.find({}, {
                                            available: true,
                                            applied: false,
                                            in_order: false
                                          }).then(function (guys, err) {

                                            if (guys) {
                                              for (i = 0; i < guys.length; i++) {

                                                initiate_job_request(tempOrder.id, guys[i].token, tempOrder.provider_location, tempOrder.customer_location, function (initiate, err) {

                                                })
                                                //send job notification to guys

                                              }

                                              setTimeout(function () {

                                                Pending.update({id:tempOrder.id},{apply_to:false}).then(function (timeOut,err) {

                                                  if(timeOut)
                                                  {

                                                    Pending.findOne({id:tempOrder.id}).populate('applicants').then(function (results,err)
                                                    {
                                                      if(results.applicants.length!=0)
                                                      {
                                                       //notify the first andidate that he is selected for the job
                                                        //update the order lock // turn the applied lock false
                                                        //release applied lock of all other applications
                                                        notify_parties(results.applicants[0],tempOrder.id,provider.token,cus.token,function (ok,err) {

                                                        })
                                                      //  notify_guy(tempOrder,provider,cus,function (ok) {

                                                       // })
                                                      //  release_locks
                                                        console.log(results.applicants[0]);
                                                      }

                                                      else if(results.applicants.length==0)
                                                      {
                                                        //turn on the job assignment scheduler lock
                                                        //job asignment scheduler takes the pending order, broadcast details to guys
                                                        //the one which accept
                                                        console.log("no guys")
                                                        //or notify both parties about non availablity of the guy and try some time later...
                                                      }
                                                      else

                                                      {console.log(err)
                                                        console.log("faaaill")}

                                                    })
                                                  }
                                                  else if(err)
                                                  {
                                                    console.log("ffailure")
                                                   console.log(err)

                                                  }
                                                })
                                              },15000)


                                            }

                                          })


                                        }
                                        else if (err) {
                                          console.log("we are not done")
                                        }
                                      })
                                    }
                                    else if (err) {
                                      console.log("no cus find")
                                    }

                                  })

                                  //delivery guy selection system starts here,

                                  //seletion
                                  //notifying three parties having scheduler place in back end
                                  //and stuf
                                }
                                else
                                  res.json({status: "-1"})
                              })

                            }, 20000)

                          }


                          else if (err)
                            res.json({err})


                        })
                        //function to provider having arguments of token of provider and id of the temp order
                        //wait for some time then execute the function of the status of the order approved or not
                        //check for the responses

                      }

                      else if (p_err) {
                        res.json({exists: 0}) //0 is for error
                      }

                      else {
                        res.json({exists: -1})//-1 is for not existing on the system any more
                      }


                    })


                  }

                  else if (o_err) {
                    res.json({order_creation: -1})
                  }

                })

              }

              else if (l_error) {
                res.json({location: -1})
              }

            });
          } catch (exception) {
            //response here
            res.json({location: -1})

          }


        }

        else {
          res.json({item_online: -1})
        }

      }

      else if (data == "" || data == undefined || data == null) {
        res.json({item_exists: -1})
      }
      else if (f_err) {
        res.json({item_exists: -1})
      }
    })

  },


  acceptOrder: function (req, res) {

    var params = req.body;
    var order_id = params.order_id;
    console.log(params);

    Pending.findOne({id: order_id}).then(function (order, err) {
      if (order.lock == true) {

        Pending.update({id: order_id}, {provider_response: 1}).then(function (accepted, err) {
          if (accepted[0]) {
            res.json({order: 1})
          }
          else if (err) {
            res.json({order: -1})
          }

        })
      }

      else if (order.lock == false) {
        res.json({order: 0})
      }

      else if (err) {
        res.json({order: -1})
      }
    })
  },




  apply: function (req,res) {

    var params = req.body;
    var id = params.id;
    var order_id = params.order_id;
    var guy_token= params.guy_token;
    console.log(params)

    Guy.update({id:id},{applied:true}).then(function (applied,err) {
      if(applied) {
        Pending.findOne({id: order_id}).then(function (order, err) {
          if (order.apply_to == true) {

            Jobcandidates.create({
              guy_id:id,
              guy_token: guy_token,
              pending_order_id: order_id,
              candidates: order_id
            }).then(function (done, err) {
              if (done) {
                res.json({order: 1})
              }
              else if (err) {
                res.json({order: -1})
              }

            })
          }

          else if (order.apply_to == false) {
            res.json({order: 0})
          }

          else if (err) {
            res.json({order: -1})
          }
        })

      }

      else  if (err)
      {
        res.json({order: -1})
      }










    })



  }



};






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
  var ordered_order_id=temp_order_id;

  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: token,


    notification: {
      title: "ORDER " + ordered_dish_name,
      body: ordered_dish_quantity+" "+ordered_dish_unit +"\n"+"tap to accept"

    },

    data: {  //you can send only notification or only data(or include both)

      temp_order_id: ordered_order_id,
      type:"order"
    }};


    fcm.send(message, function(err, response){
    if (err) {

      console.log(err)
      console.log("Something has gone wrong!");
      return callback("",-1)

    }
    else if(response)
    {
        return callback(1,"")
    }
  });

}

function initiate_job_request(order_id,guyToken,providerLocation,customerLocation,callback) {
  var FCM = require('fcm-node');
  var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
  var fcm = new FCM(serverKey);

  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: guyToken,


    notification: {
      title: "JOB ",
      body: "From " + providerLocation+" "+"\n"+"To"+" "+customerLocation

    },

    data: {  //you can send only notification or only data(or include both)

      temp_order_id:order_id,
      type:"job"
    }};


  fcm.send(message, function(err, response){
    if(response)
    {console.log(response)}
    else if(err)
    {console.log(err)}
  })
}

function  notify_parties(guy,order_id,provider,customer,callback) {


  var provider_token = provider.token
  var customer_token= customer.token
  Guy.findOne({id:guy.guy_id,}).then(function (guy,err) {
    if(guy) {
      Pending.update({id: order_id}, {guy_name: guy.name, guy_cell: guy.cell}).then(function (data, err) {
        if(data)
        { User.update({id:provider.id},{fp_orders:order_id}).then(function (prov,err) {})//updating provider field
          Customer.update({id:customer.id},{cus_orders:order_id}).then(function () {})//updating customer order field

          var guy_name = guy.name
          var guy_cell = guy.cell
          var token;
          var FCM = require('fcm-node');
          var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
          var fcm = new FCM(serverKey);
          var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: token,
            notification: {
              title: "Delivery Guy Details ",
              body: guy_name + " "+"\n"+guy_cell+"\n"+"tap to acknowledge"},
            data: {
              type: "details"
            }
          };
          for (i = 0; i < 2; i++) {

            if(i==0)
            {
              message.to=provider_token
            }
            else if(i==1)
            {
              message.to=customer_token
            }
            fcm.send(message, function(err, response){});

          }
          Pending.update({id:order_id},{ack_scheduler_allowed:true}).then(function (req,res) {
            //code for ack scheduler remaining
          })

        }

      })



    }



  })
  //get the details of the guy , and send it to  parties , release the lock for the notification sceduler

}
