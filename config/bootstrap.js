/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  sails.on('lifted', function() {
    var schedule = require('node-schedule');

    var j = schedule.scheduleJob('*/1 * * * *', function(){

      Pending.find({},{ack_scheduler_allowed:true}).then(function (data,err) {

        if(data)
        {
         for(i=0;i<data.length;i++)
         {

           if(data[i].acked_by_customer==false)
           {

              //  send_again_to_customer(data[i],function () {

               // })

                  //fucntion to re-initiate to customer
           }
           if(data[i].acked_by_provider==false)
           {
             send_again_to_provider(data[i],function () {

             })
           }

           if(data[i].acked_by_guy==false&&data[i].guy_id!="-1")
           {
             send_again_to_guy(data[i],function () {

             })
           }

         }
        }

          else if(err)
        {}
      })

    });
  });



  function send_again_to_customer(order,callback) {

    var FCM = require('fcm-node');
    var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
    var fcm = new FCM(serverKey);

    var customer_id = order.customer_id;

    Customer.findOne({id:customer_id}).populate('cus_orders').then(function (customerPAYLOAD,err) {

      if(customerPAYLOAD)
      {
        var customer_token = customerPAYLOAD.token
        var guy_status = order.guy_cell
        if(guy_status!="-1")//means  DG assigned to this order
        {
          var customer_order_list = []
          customer_order_list = customerPAYLOAD.cus_orders
          var guy_name = order.guy_name;
          var guy_cell= order.guy_cell;

          var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: customer_token,

            notification: {
              title: "Delivery Guy Details ",
              body: guy_name + " " + "\n" + guy_cell + "\n" + "tap to acknowledge"
            },
            data: {
              order: "",
              type: "assigned"
            }
          };

          message.data.order = customer_order_list
        }
        else if (guy_status=="-1")//means no DG assigned to this order
        {
          var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: customer_token,
            notification: {
              title: "No guy is available to deliver :(",
              body: order.ordered_dish + "\n" + order.ordered_quantity + " " + order.ordered_unit + "\n" + "TRY LATER" + "\n" + "tap to exhaust"
            },
            data: {
              type: "N/A"
            }
          };
        }

        fcm.send(message, function (err, response) {

          if (response) {
            console.log(response)
          }
          else if (err) {
            console.log("error while sending")
          }
        });

        //get customer token
        //check if delivery guy field is not default , if default then it mean no guy assigned
        //two types of notifications generations
      }
      else if(err)
      {console.log("error")}

    })
  }

  function send_again_to_provider(order,callback) {

    var FCM = require('fcm-node');
    var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
    var fcm = new FCM(serverKey);

    var provider_id = order.provider_id;

    User.findOne({id:provider_id}).populate('fp_orders').then(function (providerPAYLOAD,err) {

      if(providerPAYLOAD)
      {
        var provider_token = providerPAYLOAD.token
        var guy_status = order.guy_cell
        if(guy_status!="-1")//means  DG assigned to this order
        {
          var provider_order_list = []
          provider_order_list = providerPAYLOAD.fp_orders
          var guy_name = order.guy_name;
          var guy_cell= order.guy_cell;

          var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)


            notification: {
              title: "Delivery Guy Details ",
              body: guy_name + " " + "\n" + guy_cell + "\n" + "tap to acknowledge"
            },
            data: {
              order: "",
              type: "assigned"
            }
          };

          message.data.order = provider_order_list
        }
        else if (guy_status=="-1")//means no DG assigned to this order
        {
          var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)

            notification: {
              title: "No guy is available to receive",
              body: order.ordered_dish + "\n" + order.ordered_quantity + " " + order.ordered_unit + "\n" + "\n" + "tap to exhaust"
            },
            data: {
              type: "N/A"
            }
          };
        }
          message.to=provider_token
        fcm.send(message, function (err, response) {

          if (response) {
            console.log(response)
          }
          else if (err) {
            console.log("error while sending")
          }
        });

        //get customer token
        //check if delivery guy field is not default , if default then it mean no guy assigned
        //two types of notifications generations
      }
      else if(err)
      {console.log("error")}

    })

  }


  function send_again_to_guy(order,callback) {

    var guy_id= order.guy_id

      Guy.findOne({id:guy_id}).populate('guy_orders').then(function (fullguy,err) {
        if(fullguy)
        {
          var guy_order_list= fullguy.guy_orders

          var FCM = require('fcm-node');
          var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
          var fcm = new FCM(serverKey);
          var message = {
            to: fullguy.token,
            notification: {
              title: "Order details",
              body: "tap to view details"
            },
            data: {
              data:  guy_order_list,
              type: "order_details"
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
        {
          console.log("err")
        }

      })


//keep critical checks n mind .. whhile building parsers


  }
































   cb();
};
