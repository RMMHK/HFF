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

         res.json({process:1})
       }
       else if(err)
       {
         res.json({process:-1})
       }

      })
    } else if (status  = "cbc")
    {
      Pending.update({id: order_id}, {cancelled_by_customer:true,guy_marked_status:"1"}).then(function (data,err) {
        if (data[0])
        {
          notify_provider(data[0],function () {
          })
          res.json({process:1})
        }
        else if(err)
        {
          res.json({process:-1})
        }

      })

    }

    else if (status =="delivered")
    {Pending.update({id: order_id}, {guy_marked_status:"1"}).then(function (data,err) {
        if (data[0])
        {
          res.json({process:1})
        }
        else if(err)
        {
          res.json({process:-1})
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
              res.json({process:1})
              else if (err)
                res.json({process:-1})

            })}
          else if(err) {
            res.json({process: -1})
          }
        })
      }
      else if(err)
      {
        res.json({process:-1})
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
                  res.json({process:1})
                else if (err)
                  res.json({process:-1})

              })}
            else if(err) {
              res.json({process: -1})
            }
          })
        }
        else if(err)
        {
          res.json({process:-1})
        }

      })}






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
          body: order.ordered_dish + " " + "\n" + order.ordered_quantity + " " + order.order_unit + "\n" + "cancelled by provider"
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
          body: order.ordered_dish + " " + "\n" + order.ordered_quantity + " " + order.order_unit + "\n" + "cancelled by customer"
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
