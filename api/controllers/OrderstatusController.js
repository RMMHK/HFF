/**
 * OrderstatusController
 *
 * @description :: Server-side logic for managing orderstatuses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  setOrderStatus:function (req,res) {

    var params = req.body;
    var order_id= params.order_id
    var status= params.order_status
    var guy_id = params.guy_id

    //two roles
    //1 take to order id and update the staus of the order
    // releas the in order bit of the guy

    //cbp
    //cbc
    //fbp
    //fbc
    //delivered
    if(status=="cbp") {
      Pending.update({id: order_id}, {cancelled_by_provider:true,guy_marked_status:"1"}).then(function (data,err) {
       if (data[0])
       {
          notify_customer(data[0],function () {
          })

         sendresponse(guy_id,1,res,function () {})
       }
       else if(err)
       {

         sendresponse(guy_id,-1,res,function () {

         })
       }

      })
    } else if (status == "cbc")
    {
      Pending.update({id: order_id}, {cancelled_by_customer:true,guy_marked_status:"1"}).then(function (data,err) {
        if (data[0])
        {
          notify_provider(data[0],function () {
          })

          sendresponse(guy_id,1,res,function () {})


        }
        else if(err)
        {

          sendresponse(guy_id,-1,res,function () {

          })
        }

      })

    }

    else if (status =="delivered")
    {Pending.update({id: order_id}, {guy_marked_status:"1",delivered:true}).then(function (data,err) {
        if (data[0])
        {
          sendresponse(guy_id,1,res,function () {

          })
          // send ratings notifications to customer
         setTimeout(function () {
            Customer.findOne({id: data[0].customer_id}).then(function (cusPAYLOAD, err) {
              if (cusPAYLOAD) {
                var token = cusPAYLOAD.token;
                var FCM = require('fcm-node');
                var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
                var fcm = new FCM(serverKey);
                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                  to: token,
                  notification: {
                    title: "So how was it!!!!!",
                    body: data[0].ordered_dish + " " + "\n" + data[0].ordered_quantity + " " + data[0].ordered_unit
                  },
                  data: {
                    order:data[0].id,
                    type: "rating"          /// type of notification to customer
                  }
                };

                fcm.send(message, function (err, response) {

                  if (response) {
                    console.log(response)
                  }
                  else if (err) {
                    console.log("error while sending")
                  }
                });

              }
            })},1000)//900000
        }
        else if(err)
        {

          sendresponse(guy_id,-1,res,function () {

          })
        }

      })}

    else if (status =="fbp")
    {
      Pending.update({id: order_id}, {fraud_by_provider:true,guy_marked_status:"1"}).then(function (data,err) {
      if (data[0])
      {
        notify_customer(data[0],function () {
        })
        User.findOne({id: data[0].provider_id}).then(function (provider, err) {

          if(provider)
          {
            var warnings= provider.f_warnings
            warnings = warnings+1
            User.update({id:provider.id},{f_warnings:warnings}).then(function (data,err) {
              if(data[0])
              {
                sendresponse(guy_id,1,res,function () {

                })}
              else if (err)
              {
                sendresponse(guy_id,-1,res,function () {

                })}

            })}
          else if(err) {

            sendresponse(guy_id,-1,res,function () {

            })
          }
        })
      }
      else if(err)
      {

        sendresponse(guy_id,-1,res,function () {

        })
      }

    })}


    else if (status =="fbc")
    {
      Pending.update({id: order_id}, {fraud_by_customer:true,guy_marked_status:"1"}).then(function (data,err) {
        if (data[0])
        {
          Customer.findOne({id: data[0].customer_id}).then(function (customer, err) {
            if(customer)
            {
              var warnings= customer.f_warnings
              warnings = warnings+1
              Customer.update({id:customer.id},{f_warnings:warnings}).then(function (data,err) {
                if(data[0])
                {
                  sendresponse(guy_id,1,res,function () {

                  })}
                else if (err)
                {
                  sendresponse(guy_id,-1,res,function () {

                  })}


              })}
            else if(err) {

              sendresponse(guy_id,-1,res,function () {

              })
            }
          })
        }
        else if(err)
        {

          sendresponse(guy_id,-1,res,function () {

          })
        }

      })}


Guy.update({id:guy_id},{in_order:false}).then(function (data,err) {
  if(data[0])
  {
    console.log("guy order key released")
  }
  else if (err)
  {console.log("error during releasing key")}

})

  }

};

function notify_customer(order,callback) {
  Customer.findOne({id: order.customer_id}).then(function (cusPAYLOAD, err) {
    if (cusPAYLOAD) {
      var token = cusPAYLOAD.token;
      var FCM = require('fcm-node');
      var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
      var fcm = new FCM(serverKey);
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        notification: {
          title: "Order",
          body: order.ordered_dish + " " + "\n" + order.ordered_quantity + " " + order.ordered_unit + "\n" + "cancelled by provider"
        },
        data: {
          type: "cbp"          /// type of notification to customer
        }
      };

      fcm.send(message, function (err, response) {

        if (response) {
          console.log(response)
        }
        else if (err) {
          console.log("error while sending")
        }
      });
    }

    else if (err)
    {console.log("database error")}
  })
}



function notify_provider(order,callback) {
  User.findOne({id: order.provider_id}).then(function (providerPAYLOAD, err) {
    if (providerPAYLOAD) {
      var token = providerPAYLOAD.token;
      var FCM = require('fcm-node');
      var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
      var fcm = new FCM(serverKey);
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        notification: {
          title: "Order",
          body: order.ordered_dish + " " + "\n" + order.ordered_quantity + " " + order.ordered_unit + "\n" + "cancelled by customer"
        },
        data:
        {type: "cbc"          /// type of notification to provider
           }
      };

      fcm.send(message, function (err, response) {

        if (response) {
          console.log(response)
        }
        else if (err) {
          console.log("error while sending")
        }
      });
    }

    else if (err)
    {console.log("database error")}
  })
}

function sendresponse(guy,response,res,callback) {

  Guy.findOne({id:guy}).populate('guy_orders').then(function (data,err) {

    if(data)
    {
      res.json({process:response,orders:data.guy_orders})
    }
    else if (err)
    {
      res.json({process:-1,orders:data.guy_orders})
    }
  })
}
