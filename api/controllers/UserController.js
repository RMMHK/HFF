/**
 * UserController
 *
 * @description :: Server-side logic for managing users
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
       User.find({email:params.email}).then(function(data,err) {
         if (data!="") {res.json({status: "duplicate"})}

         else if (data==""||!data)
         {User.create({v_id: params.v_id, name: params.name, email: params.email,account_secret:params.account_secret, cell: params.cell, cnic: null, f_status: false, f_warnings: 0, current_location: null,token:params.token}).then(function (data, err) {
             if (data)
             {
               res.json({status:true,user:data});//response


               



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
         User.find({email: email}).then(function (data, err) {
           if (data != "") {
             res.json({status: "duplicate"})
             return
           }

           else if (data == "" || !data) {
             User.update({v_id: params.v_id}, {name: params.name ,email: params.email,account_secret: params.account_secret}).then(function (err) {
                 User.findOne({name: params.name,email: params.email,account_secret: params.account_secret}).then(function (data, err) {
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

       User.update({v_id: params.v_id},{name: params.name ,account_secret:params.account_secret}).then(function (err) {

           User.findOne({name: params.name,account_secret: params.account_secret}).then(function (data, err) {
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

    User.findOne({v_id:params.v_id}).then(function(data,err){

      console.log( req.url);
      console.log( req.headers);
      var params = req.body;
      console.log(params.v_id);

      if (err)
      {
        res.json({exists: false});
       // console.log("err"+o);
      }
      else if (data==""||!data)
      {res.json({exists: false});}

      else if (data)
      {
        //response

        User.update({v_id: params.v_id},{token:params.token}).then(function (data,err) {

          if(data) {
            res.json({exists: true, user: data})
            console.log(data)
          }

       else if (err)
         {res.json({exists: false})}
        })
      }
    })


  },


  change_number:function (req,res,next) {

    console.log(req.body);
    var params = req.body;
    var new_id= params.id;
    User.update({v_id:params.current},{v_id:new_id,cell:params.cell}).then(function (err,updated) {

       try {
         User.findOne({v_id:new_id}).then(function(data,err)
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

  User.update({id:req.param('id')},{name:'Bhaluooo'}).then(function afterwards(err, updated){

    if (err) {
      return err;
    }
    res.json(updated);
  });
  },

  verify_phone:function (req,res,next){

    var params = req.body;

    console.log(params.cell);


    User.findOne({cell:params.cell}).then(function(data,err){

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


    User.findOne({cell: params.cell}).then(function (data, err) {

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

    User.destroy({}).then(function (err) {
      if (err) {
        return res.json({status:"failed"})
      }

      else
        return res.json({status:"success"})

      res.redirect('/user')


    });
  },



name_search: function (req,res,next) {
  User.find({name:req.param('name')}).exec(function (err, usersNamedFinn){
    if (err) {
      return res.serverError(err);
    }
    sails.log('Wow, there are %d users named ' ,console.log(req.param('name')), 'Check it out:', usersNamedFinn.length, usersNamedFinn);
    return res.json(usersNamedFinn);
  });


},










 // search:function (req,res,next) {

    //if(req.param.id!=null) {
    /*   User.findOne(req.param('id'),function foundUser(err,user) {
     if (err) return(res.json({err:"no"}));
     if (!user) return next();

     res.json(user);

     })
     //  else if(req.param.name!=null) {
     /* User.findOne(req.param('name'),function foundUser(err,user) {
     if (err) return(res.json({err:"no here"}));
     if (!user) return next();

     res.json(user);

     })*/

/*var param=req.body;
    User.findOne({name:req.param('name')}).exec(function (err, finn) {
      if (err) {
        return res.serverError(err);
      }
      if (!finn) {
        return res.notFound('Could not find Rana, sorry.');
      }

      sails.log('Found "%s"', finn.fullName);
      return res.json(finn);
    });


  },*/



   /* if(req.params.name==null&&req.params.cell!=null&&req.params.email==null) {
      User.find({cell: params.cell}).exec(function (err, user) {
        if (err) {
          return res.serverError(err);
        }
        return res.json(user);
      });
    }

      if(req.params.name==null&&req.params.cell==null&&req.params.email!=null) {
        User.find({cell: params.cell}).exec(function (err, user) {
          if (err) {
            return res.serverError(err);
          }
          return res.json(user);
        });*/











/*
addUser: function(req, res) {
        //SQL query
        return res.json({success: true});
  },
  _config: {}*/

};

