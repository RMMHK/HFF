/**
 * GuyController
 *
 * @description :: Server-side logic for managing guys
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  'signup_form': function (req,res)
  {
    res.locals.flash=_.clone(req.session.flash);
    res.view();
    req.session.flash={};
  },

  made: function(req, res, next) {
    //console.log("This is create fucntion");
    console.log( req.url);
    // console.log( req.headers);
    var params = req.body;

    var type = params.type;

    try {var email = params.email; console.log({email:params.email});}
    catch (Exception){}

    console.log(type);
    console.log(params.name);
    console.log(params.cell);
    console.log(params.v_id);


    if (type=="REGISTER")
    {
      Guy.find({email:params.email}).then(function(mail,err) {
        if (mail!="") {res.json({status: "duplicate"})}

        else if (mail==""||!mail)
        {Guy.create({v_id: params.v_id, name: params.name, email: params.email,cell: params.cell, cnic: null, f_status: false,location: null,token:params.token}).populate('guy_orders').then(function (user, err) {
          if (user!=null&&user!=undefined&&user!="")
          {

            res.json({status:true,user:user,orders:user.guy_orders});//response
          }

          else if(user==null||user==undefined||user==" ")
          {
            (res.json({status:false}))
          }
          else if(err) {
            (res.json({status:false}))
          }
        })
        }
      })
    }
    else if (type=="UPDATE_USER_DATA")
    {
      try {
        if (!email.undefined || email != "") {
          Guy.find({email: email}).then(function (data, err) {
            if (data != "") {
              res.json({status: "duplicate"})
              return
            }

            else if (data == "" || !data) {
              Guy.update({v_id: params.v_id}, {name: params.name ,email: params.email,account_secret: params.account_secret}).then(function (err) {
                Guy.findOne({name: params.name,email: params.email,account_secret: params.account_secret}).then(function (data, err) {
                  if (err) {
                    res.json({status: false});
                  }
                  else if (data == "" || !data) {
                    res.json({status: false});
                  }

                  else if (data) {
                    res.json({status: true, user: data})//response
                  }
                })

              })
            }
          })
        }
      }
      catch(Exception) {

        Guy.update({v_id: params.v_id},{name: params.name ,account_secret:params.account_secret}).then(function (err) {

          Guy.findOne({name: params.name,account_secret: params.account_secret}).then(function (data, err) {
            if (err) {
              res.json({status: false});
            }
            else if (data == "" || !data) {
              res.json({status: false});
            }

            else if (data) {
              res.json({status: true, user: data})//response
            }
          })})
      }

    }


  },


  ping:function (req,res,next) {

    /* User.findOne({id:req.param('id')}.then(function foundUser(err,user) {
     if (err) { console.log("error");return(next);}
     if (!user){console.log(("no user found")); return next();}*/

    res.json({ping: "Han g"});
  },



  verify:function (req,res,next){

    var params = req.body;

    Guy.findOne({v_id:params.v_id}).populate('guy_orders').then(function(data,err) {


      var params = req.body;
      console.log(params.v_id);
      console.log(params.token);
       console.log(data)
      if (err) {
        res.json({exists: false});
      }
      else if (data == "" || !data) {
        res.json({exists: false});
      }

      else if (data) {

        Guy.update({v_id: params.v_id}, {token: params.token}).then(function (user, err) {

          if (user[0]!=null&&user[0]!=undefined&&user[0]!="")
          {
            res.json({exists:true,user:user[0],orders:user[0].guy_orders})
          }
         else if (err) {
            res.json({exists: false})
          }
        })

      }
    })
  },


  change_number:function (req,res,next) {

    console.log(req.body);
    var params = req.body;
    var new_id= params.id;
    Guy.update({v_id:params.current},{v_id:new_id,cell:params.cell}).then(function (err,updated) {

        try {
          Guy.findOne({v_id:new_id}).then(function(data,err)
          {
            if (data&&data!=""&&!data.undefined)
            {
              res.json({status:true});
              return;
            }

            else if (err||!data)
            {
              res.json({status:false});
              return;
            }
          })
        }
        catch (Exception)
        {
          res.json({status: "false"});
        }

      }


    )},



  verify_phone:function (req,res,next){

    var params = req.body;

    console.log(params.cell);


    Guy.findOne({cell:params.cell}).then(function(data,err){

      if (err)
      {
        res.json({exists: false});
        return
        // console.log("err"+o);
      }
      else if (data==""||!data)
      {res.json({exists: false});return}

      else if (data)
      { res.json({exists:true,user:data}); return}
    })
  },


  check_new_phone:function (req,res,next) {

    var params = req.body;

    console.log(params.cell);


    Guy.findOne({cell: params.cell}).then(function (data, err) {

      if (err) {
        res.json({exists: "error"});
        return
        // console.log("err"+o);
      }
      else if (data == "" || !data) {
        res.json({exists: false});
        return
      }

      else if (data) {
        res.json({exists: true});
        return
      }
    })
  },




  delete:function (req,res,next) {

    Guy.destroy({}).then(function (err) {
      if (err) {
        return res.json({status:"failed"})
      }

      else
        return res.json({status:"success"})

      res.redirect('/user')


    });
  },

  getOrders:function (req,res) {

    var params = req.body
    Guy.findOne({id:params.id}).populate('guy_orders').then(function (data,err) {

      if(data.guy_orders.length!=0)
      {
        res.json({orders:data.guy_orders})
      }
      else if(data.guy_orders.length==0)
      {
        res.json({orders:0})
      }
      else if (err)
      {
        res.json({orders:-1})
      }
    })

  },

  updateStatus:function(req,res)
  {
    var params = req.body;
    var status = params.available
    Guy.findOne({id:params.id}).then(function (data,err) {

      if (data.applied == false && data.in_order == false) {
        update_status(params.id, status, function (status,data, err) {
          if (data == "ok")
            res.json({status: "+1",bit:status})

          else if (err == "err")
            res.json({status: "0",bit:status})
        })}

          else if (data.applied == false && data.in_order == true) {
            update_status(params.id, status, function (status,data, err) {
              if (data == "ok")
                res.json({status: "1",bit:status})

              else if (err == "err")
                res.json({status: "0",bit:status})

            })}
          else if (data.applied == true && data.in_order == false) {
          update_status(params.id, status, function (status,data, err) {
            if (data == "ok")
              res.json({status: "-1",bit:status})

            else if (err == "err")
              res.json({status: "0",bit:status})

          })}
      else if (err == "err")
          res.json({status: "-2"})
    })}};

function update_status(id,status,callback) {

  Guy.update({id:id}, {available: status}).then(function (data,err) {

    if(data[0]) {
      return callback(data[0].available, "ok", "")
    }
    else if (err) {
      return callback(data[0].available,"", "err")
    }
  })
}
