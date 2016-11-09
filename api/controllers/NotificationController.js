/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
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

    var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
    var fcm = new FCM(serverKey);

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: token,
      collapse_key: CK,

      notification: {
        title: title,
        body: body
      },

      data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
      }
    };

    fcm.send(message, function(err, response){
      if (err) {
        console.log("Something has gone wrong!");
      } else {
        console.log("Successfully sent with response: ", response);
      }
    });
  }
};


