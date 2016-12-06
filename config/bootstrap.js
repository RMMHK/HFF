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


      fraud_manager();




      Pending.find({},{ack_scheduler_allowed:true}).then(function (data,err) {

        if(data)
        {
         for(i=0;i<data.length;i++)
         {

           if(data[i].acked_by_customer==false)
           {

                send_again_to_customer(data[i],function () {

                })

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

  //  var k = schedule.scheduleJob('*/2 * * * *', function(){

//      Pending.destroy({provider_response:-1,clean_scheduler_allowed:true}).then(function (data,err) {

/*        if(data)
        {
          console.log("operation clean up completed successfully")
        }
        else
          console.log("operation clean up interrupted")
      })

      Pending.destroy({deleted_by_customer:true,deleted_by_provider:true,deleted_by_guy:true}).then(function (data,err) {
        if(data)
        {
          console.log("operation clean up completed successfully")
        }
      })

   /*   Pending.destroy({acked_by_customer:true,acked_by_provider:true,clean_scheduler_allowed:true}).then(function (data,err) {
        if(data)
        {
          console.log("operation clean up completed successfully")
        }
      })*/



    //})*/


  //  var S = schedule.scheduleJob('*/1 * * * *', function(){

  //    Apptokens.destroy({working:false}).then(function (data,err) {

  //      if(data)
   //     {
   //       console.log("operation clean up completed successfully")
  //      }
  //      else
   //       console.log("operation clean up interrupted")
  //    })

 //   })


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
          var guy_name = order.guy_name;
          var guy_cell= order.guy_cell;

          var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: customer_token,

            notification: {
              title: "Delivery Guy Details ",
              body: guy_name + " " + "\n" + guy_cell + "\n" + "tap to acknowledge"
            },
            data: {
              ack:order.id,
              type: "assigned"
            }
          };


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
              ack:order.id,
              type: "N/A"
            }
          };
        }

        fcm.send(message, function (err, response) {

          if (response) {
            console.log(response)
          }
          else if(err)
          {
          console.log(err)
          console.log("error while sending customer")
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
              ack: order.id,
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
              ack:order.id,
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
            console.log(err)
            console.log("error while sending provider")
          }
        });

        //get customer token
        //check if delivery guy field is not default , if default then it mean no guy assigned
        //two types of notifications generations
      }
      else if(err)
        console.log(err)



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
              ack:order.id,
              type: "job_details"
            }
          };
          fcm.send(message, function (err, response) {

            if (response) {
              console.log(response)
            }
            else if (err) {
              console.log(err)
              console.log("error while sending guy")
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

  function  fraud_manager() {

    block_fraud_providers()
    block_fraud_customer()

  }


function  block_fraud_providers() {
  User.find({}).then(function (data,err) {

    if (data) {
      for (i = 0; i < data.length; i++) {
        if (data[i].f_warnings >= 2&&data[i].f_status==false)
        {
          data[i].f_status = true
        }
      }

    }
    else if (err)
    { console.log("error in fraud manager")}

  })
}

  function  block_fraud_customer() {
    Customer.find({}).then(function (data,err) {

      if (data) {
        for (i = 0; i < data.length; i++) {
          if (data[i].f_warnings >= 2&&data[i].f_status==false)
          {
            data[i].f_status = true
          }
        }

      }
      else if (err)
      { console.log("error in fraud manager")}

    })
  }

   cb();
};
