module.exports = {

  sendEmail: function(req, res) {
     var params = req.body;
    var name= params.name;
    var type = params.type;
    var accSecret=params.account_secret;
    var oldCell=params.old_cell;
    var newCell=params.new_cell;
    var baseCell=params.base_cell;
    console.log(params)
    var email = params.mail;
    // sails.hooks.email.send(template, data, options, cb)

        if (type=="account Secret") {
          sails.hooks.email.send("accountSecret",
            {recipientName: name, accountSecret: accSecret, senderName: "Home Foodies"},
            {from: "Home Foodies<homefooodies@gmail.com>", to: email, subject: "Account Secret"},
            function (err, success) {
              console.log(err)
              if (err || !success) {
                console.log(err)
                res.json({status: "error"})
              }
              else if (success || !err) {
                console.log("sent")
                return ( res.json({status: "sent"}));
              }

            }
          )
        }

   else if (type=="notification")
        {
    sails.hooks.email.send("Notification",
      {recipientName: name, oldCell: oldCell,newCell: newCell,baseCell: baseCell,senderName: "Home Foodies"},
      {from: "Home Foodies<homefooodies@gmail.com>", to: email, subject: "Number changed notification"},
      function (err, success) {
        console.log(err)
        if (err!=null || !success) {
          console.log(err)
          res.json({status: "error"})
        }
        else if (success || !err) {
          console.log("sent")
          return ( res.json({status: "sent"}));
        }

      }
    )
  }}
};
