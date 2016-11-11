/**
 * UpdateController
 *
 * @description :: Server-side logic for managing updates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  send:function (req,res,next) {
    var FCM = require('fcm-node');

    var params= req.body;

    var body= params.body;
    var title = params.title;
    var CK = params.keys;
    var token = params.token;

  },


  send:function (req,res,next) {
    var dish_names=[]
    var container=[]
    var dish_types=[]

    var FCM = require('fcm-node');
    var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
    var fcm = new FCM(serverKey);
    var token

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: token,


      notification: {
        title: "Menu Updated",
        body: "Now you have more dishes to sell and taste"
      },

      data: {  //you can send only notification or only data(or include both)
        collapse_key: "1",
        dish_name: dish_names,
        dish_list: container
      }
    };

    //take in put from dishname model// populate it and prepare an appropriate output..
    Dishname.find({}).populate('Types').then(function(data,err)
    {
      if (data)  // for preparing dishname file..
      {

        var data_length= data.length;

        for(i=0;i<data_length;i++)
        {

            dish_names.push(

              data[i].DishName
            )
            }//dishnames working fine
      for(i=0;i<data.length;i++)
      {
        var dish_name=  data[i].DishName
        var order_unit= data[i].order_unit;
      // console.log(dish_types)
        for(j=0;j<data[i].Types.length;j++)
        {
          dish_types.push(
             data[i].Types[j].single_name
          )


        }
        container.push({

          dishname:dish_name,order_unit:order_unit,dishType:dish_types
        })
        dish_types=[]
      }

   //   res.json({dish_names:dish_names,order_unit:order_unit,list:container})
      }

      Apptokens.find({}).then(function (data,err) {

        if (data)
        {
           for(i=0;i<data.length;i++)
           {
             var app_token= data[i].application_token;
          //   console.log(app_token)
              //putting tokens on the line
             //console.log(token)
              message.to=app_token
             message.data.dish_name=dish_names;
             message.data.dish_list=container;
             message.collapse_key="1"
             fcm.send(message, function(err, response){

               console.log(message.to)
               if (err) {
                 console.log("Something has gone wrong!");
               } else {
                 console.log("Successfully sent with response: ", response);
               }
             });
           }
        }

      })

    })



  }


};

