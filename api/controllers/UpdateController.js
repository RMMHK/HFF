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
        title: "Menu Update",
        body: "tap to install"
      },

      data: {  //you can send only notification or only data(or include both)
        collapse_key: "1",
        dish_names: "",
        dish_types: ""
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
           var Obj ={

             name : data[i].DishName
           }
           var jsonObj = JSON.stringify(Obj)

            dish_names.push(
              {
                jsonObj
              }
            )

        }//dishnames working fine
      for(i=0;i<data.length;i++)
      {
        var o = {

          dish_name: data[i].DishName
        }

        var dish_name=  JSON.stringify(o)//JSON dishnmae

        var object = {

          unit : data[i].order_unit
        }

        var order= JSON.stringify(object)//order

        for(j=0;j<data[i].Types.length;j++)
        {

          var obj =  {
            name : data[i].Types[j].single_name
          }

           var json = JSON.stringify(obj)
          dish_types.push(
            {
              json
            }
          )


        }

      //  var types = JSON.stringify(dish_types)
        container.push({

          dish_name:dish_name,order_unit:order,dishType:dish_types
        })
        dish_types=[]
      }

      res.json({dish_names:dish_names,list:JSON.stringify(container)})
      }

      Apptokens.find({}).then(function (data,err) {
         var dishes=JSON.stringify(dish_names);
        var types=JSON.stringify(container);

      //  console.log("this"+payload);
        if (data)
        {
           for(i=0;i<data.length;i++)
           {
             var app_token= data[i].application_token;
             var v =JSON.stringify(dish_names);
              message.to=app_token
             message.data.dish_names=dishes
             message.data.dish_types=types
             message.collapse_key="1"
             fcm.send(message, function(err, response){
            //   console.log("this"+payload);
               console.log(message.to)
               console.log(message.data.dish_names)
               if (err) {

                 console.log(err)
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

