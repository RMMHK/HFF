/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  send:function (req,res,next) {
    var FCM = require('fcm-node');

    var serverKey = 'AIzaSyAqx0agqYXjwKC5z1VjuS9ZneYIeAs63WU';
    var fcm = new FCM(serverKey);

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: 'cHhVD4FbMZY:APA91bGoloVp5RKXTqHl2czI9dj6Aj9qlZhKl3lk_BA0l2N4gHUducNcEU3gAc52mDlT9HS08x8ndVUQ38gRSSLe1jCnoziYEocO6wQiRd-n9yKkkUUY_l4nEpwk0r0NfzAgu7OOBvuY',
      collapse_key: 'your_collapse_key',

      notification: {
        title: 'HELLO',
        body: 'FIRST NOTIFICATION'
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


