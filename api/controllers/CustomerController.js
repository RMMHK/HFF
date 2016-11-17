/**
 * CustomerController
 *
 * @description :: Server-side logic for managing customers
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
      Customer.find({email:params.email}).then(function(mail,err) {
        if (mail!="") {res.json({status: "duplicate"})}

        else if (mail==""||!mail)
        {Customer.create({v_id: params.v_id, name: params.name, email: params.email,account_secret:params.account_secret, cell: params.cell, cnic: null, f_status: false, f_warnings: 0, current_location: null,token:params.token}).then(function (user, err) {
          if (user)
          {
            Apptokens.findOne({application_token:params.token}).then(function (data,err) {

              if(!data||data==""||data.undefined)
              {
                Apptokens.create({application_token:params.token}).then(function (data,err) {
                  if (data)
                  {
                    res.json({status:true,user:user});//response
                  }

                  else if (err)
                    (res.json({status:false}));


                })
              }

              else if(data)
              {
                res.json({status:true,user:user})
              }
              else if (err)
              {(res.json({status:false}));}

            })





          }
          else if(err) {
            (res.json({status:false}));
          }
        })
        }
      })
    }
    else if (type=="UPDATE_USER_DATA")
    {
      try {
        if (!email.undefined || email != "") {
          Customer.find({email: email}).then(function (data, err) {
            if (data != "") {
              res.json({status: "duplicate"})
              return
            }

            else if (data == "" || !data) {
              Customer.update({v_id: params.v_id}, {name: params.name ,email: params.email,account_secret: params.account_secret}).then(function (err) {
                Customer.findOne({name: params.name,email: params.email,account_secret: params.account_secret}).then(function (data, err) {
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

        Customer.update({v_id: params.v_id},{name: params.name ,account_secret:params.account_secret}).then(function (err) {

          Customer.findOne({name: params.name,account_secret: params.account_secret}).then(function (data, err) {
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

    Customer.findOne({v_id:params.v_id}).then(function(data,err) {

      console.log(req.url);
      console.log(req.headers);
      var params = req.body;
      console.log(params.v_id);
      console.log(params.token);

      if (err) {
        res.json({exists: false});
        // console.log("err"+o);
      }
      else if (data == "" || !data) {
        res.json({exists: false});
      }

      else if (data) {
        //response

        Customer.update({v_id: params.v_id}, {token: params.token}).then(function (user, err) {

          if (user[0]) {

            Apptokens.findOne({application_token: params.token}).then(function (data, err) {

              if (!data || data == "" || data.undefined) {
                Apptokens.create({application_token: params.token}).then(function (data, err) {
                  if (data) {
                    res.json({exists: true, user: user[0]})//response
                  }

                  else if (err) {
                    res.json({exists: false})
                  }
                })
              }

              else if (data) {
                res.json({exists: true, user: user[0]})
              }

              else if (err) {
                res.json({exists: false})
              }
            })
          }
          if (err) {
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
    Customer.update({v_id:params.current},{v_id:new_id,cell:params.cell}).then(function (err,updated) {

        try {
          Customer.findOne({v_id:new_id}).then(function(data,err)
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


  edit:function (req,res,next){

    Customer.update({id:req.param('id')},{name:'Bhaluooo'}).then(function afterwards(err, updated){

      if (err) {
        return err;
      }
      res.json(updated);
    });
  },

  verify_phone:function (req,res,next){

    var params = req.body;

    console.log(params.cell);


    Customer.findOne({cell:params.cell}).then(function(data,err){

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


    Customer.findOne({cell: params.cell}).then(function (data, err) {

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

    Customer.destroy({}).then(function (err) {
      if (err) {
        return res.json({status:"failed"})
      }

      else
        return res.json({status:"success"})

      res.redirect('/user')


    });
  },



  name_search: function (req,res,next) {
    Customer.find({name:req.param('name')}).exec(function (err, usersNamedFinn){
      if (err) {
        return res.serverError(err);
      }
      sails.log('Wow, there are %d users named ' ,console.log(req.param('name')), 'Check it out:', usersNamedFinn.length, usersNamedFinn);
      return res.json(usersNamedFinn);
    });


  },

























};
