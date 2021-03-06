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
    Customer.findOne({id: customer_id}).then(function (cus, err) {

      if(cus.f_status!=true) {
        Fooditem.findOne({id: item_id}).populate('eshop').then(function (data, f_err) {

          if (data != "" && data != undefined && data != null) {
            if (data.status != false && data.eshop.ES_STATUS != false) {
              try {
                get_customer_location(parseFloat(cus_lat), parseFloat(cus_long), function (location, l_error) {

                  if (location) {
                    Pending.create({
                      item_id: item_id,
                      customer_id: customer_id,
                      provider_id: provider_id,
                      provider_location: data.eshop.ES_LOCATION,
                      ordered_dish_type: data.type_of_food,
                      ordered_dish: data.name,
                      ordered_quantity: params.quantity,
                      ordered_bill: params.ordered_price,
                      ordered_unit: data.selling_unit,
                      customer_location: location,
                      price_per_unit:data.price,
                      description:data.description
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
                                                  }
                                                  setTimeout(function () {
                                                    Pending.update({id: tempOrder.id}, {apply_to: false}).then(function (timeOut, err) {
                                                      if (timeOut) {
                                                        Pending.findOne({id: tempOrder.id}).populate('applicants').then(function (results, err) {
                                                          if (results.applicants.length != 0) {
                                                            notify_parties(results.applicants[0], tempOrder, provider, cus, "success", function (ok, err) {
                                                            })
                                                            notify_guy(tempOrder, results.applicants[0], function (ok) {
                                                            })
                                                            release_apply_lock(results.applicants, function (ok) {
                                                              if (ok) {
                                                                console.log(ok)
                                                              }
                                                            })
                                                          }
                                                          else if (results.applicants.length == 0) {
                                                            notify_parties("", tempOrder, provider, cus, "N/A", function (ok, err) {
                                                            })
                                                            Pending.update({id: tempOrder.id}, {clean_scheduler_allowed: true}).then(function () {
                                                            })

                                                          }
                                                          else {
                                                            console.log(err)
                                                            console.log("faaaill")
                                                          }
                                                        })
                                                      }
                                                      else if (err) {
                                                        console.log("ffailure")
                                                        console.log(err)
                                                      }
                                                    })
                                                  }, 15000)
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
                                    }
                                    else
                                      res.json({status: "-1"})
                                    Pending.update({id: tempOrder.id}, {clean_scheduler_allowed: true}).then(function () {
                                    })
                                  })
                                }, 20000)
                              }
                              else if (err)
                                res.json({err})
                            })
                          }
                          else if (p_err) {
                            res.json({exists: 0}) //0 is for error
                          }
                          else {
                            res.json({exists: -1})//-1 is for not existing on the system any more
                          }
                        })
                      } else if (o_err) {
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

      }
    else if (cus.f_status==true)
      {
        res.json({fraud:1})
      }
      else if(err)
      {
        res.json({err:1})
      }

    })
  },


  acceptOrder: function (req, res) {

    var params = req.body;
    var order_id = params.order_id;
    console.log(params);

    Pending.findOne({id:order_id}).then(function (order, err) {
      if(order) {
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

    Pending.findOne({id: order_id}).then(function (order, err) {
      if (order.apply_to == true) {

      Guy.update({id:id},{applied:true}).then(function (applied,err) {
      if(applied) {
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
          else if (err) {
            res.json({order: -1})
          }
        })
      }
      else if (order.apply_to == false) {
        res.json({order: 0})
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
    return callback("",error)
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

function  notify_parties(guy,order,provider,customer,mode,callback) {


  var provider_token = provider.token
  var customer_token = customer.token

  if (mode == "success") {
    Guy.findOne({id: guy.guy_id,}).then(function (guy, err) {
      if (guy) {
        Pending.update({id: order.id}, {guy_id:guy.id,guy_name: guy.name, guy_cell: guy.cell}).then(function (data, err) {
          if (data) {

           /* User.update({id: provider.id}, {fp_orders: order.id}).then(function (prov, err) {
            })//updating provider field
            Customer.update({id: customer.id}, {cus_orders: order.id}).then(function () {
            })//updating customer order field*/

            User.findOne({id: provider.id}).then(function (providerPAYLOAD, err) {

              if (providerPAYLOAD) {

                Pending.update({id:order.id},{provider:providerPAYLOAD.id}).then(function () {})

                Customer.findOne({id: customer.id}).then(function (cusPAYLOAD, err) {

                  if (cusPAYLOAD)
                  {
                    Pending.update({id:order.id},{customer:cusPAYLOAD.id}).then(function () {})

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
                        body: guy_name + " " + "\n" + guy_cell + "\n" + "tap to acknowledge"
                      },
                      data: {
                        ack: order.id,
                        type: "assigned"            //data payloads to customer and provider
                      }
                    };
                    for (i = 0; i < 2; i++) {

                      if (i == 0) {
                        message.to = provider_token

                      }
                      else if (i == 1) {
                        message.to = customer_token
                      }
                      fcm.send(message, function (err, response) {

                        if (response) {
                          console.log(response)
                        }
                        else if (err) {
                          console.log("error while sending")
                        }
                      });

                    }
                  }

                })


              }


            })
          }
          else if (err) {
            console.log("Customer payload not exeuted")
          }

        })
      }
      else if (err) {
        console.log("not executed")
      }

    })


    //get the details of the guy , and send it to  parties , release the lock for the notification sceduler

  }
  else if (mode == "N/A") {

    var FCM = require('fcm-node');
    var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
    var fcm = new FCM(serverKey);
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: "",
      notification: {
        title: "No guy is available to deliver :(",
        body: order.ordered_dish + "\n" + order.ordered_quantity + " " + order.ordered_unit + "\n" + "TRY LATER" + "\n" + "tap to exhaust"
      },
      data: {
        ack:order.id,
        type: "N/A"                          //no pay load // but notification
      }
    };
    for (i = 0; i < 2; i++) {

      if (i == 0) {

          message.to = provider_token
          message.notification. title= "No guy is available to receive",
          message.notification.body= order.ordered_dish + "\n" + order.ordered_quantity + " " + order.ordered_unit + "\n" + "\n" + "tap to exhaust"
      }
      else if (i == 1)
      {
         message.to = customer_token

      }
      fcm.send(message, function (err, response) {

        if (response) {
          console.log(response)
        }
        else if (err) {
          console.log("error while sending")
        }
      });
//ack candidate
    }


  }

  Pending.update({id: order.id}, {ack_scheduler_allowed: true}).then(function (req, res) {
    //code for ack scheduler remaining
  })
}


 function notify_guy(order,guy,callback) {


 Guy.update({id:guy.guy_id},{in_order:true}).then(function (data,err) {

 })
   Pending.update({id:order.id},{guy:guy.guy_id}).then(function () {

   })
   Guy.findOne({id:guy.guy_id}).populate('guy_orders').then(function (fullguy,err) {

     if(fullguy)
     {

       var FCM = require('fcm-node');
       var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
       var fcm = new FCM(serverKey);
       console.log(fullguy.token)
       var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
         to: fullguy.token,
         notification: {
           title: "Order details",
           body: "tap to view details"
         },
         data: {
           ack:order.id,
           type: "job_details"              //data pay  load and notification to DG
         }
       };
       fcm.send(message, function (err, response) {

         if (response) {
           console.log(response)
         }
         else if (err) {

           console.log(err)
         }
       });
     }

     else if (err)
     {
       console.log("err")
     }

   })

}

function release_apply_lock(applicants,callback) {

  for(i=0;i<applicants.length;i++)
  {

    Guy.update({id:applicants[i].guy_id},{applied:false}).then(function (success,err) {

      if(success)
      {
        console.log("APPLIED LOCK RELEASED SUCCESSFULLY")
        return(callback("MY JOB OF HANDLING ORDER DONE HERE, HUM MENNU ARAM KARAN DAY .. COCA COLA TAY PIYA HUN"))

      }
      else if(err)
      {
        return(callback("err"))
      }
    })


  }
}











