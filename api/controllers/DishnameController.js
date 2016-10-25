/**
 * DishnameController
 *
 * @description :: Server-side logic for managing dishnames
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  dishOperations:function (req,res,next) {
    var params = req.body;
    console.log(params)



    Dishname.create({dishName:"biryani"}).then(function (err,data) {

      if (!err)
        res.json({data})
     else if(err)
        res.json({err:err})
     else if (data)
        res.json({data})
    })},

    undo:function (req,res,next) {

      Dishname.destroy({}).then(function (err,data) {

        if (!err)
          res.json({data})
        if(err)
          res.json({err:err})

      })

    }



  /*TAKE THE DISH NAME FIND IT AND IF EXIST SAVE ITS ID IN A VARIABLE AND THEN CREATE A TYPE AND PUT
   THE ID OF THE DISH NAME IN JOINT ATTRITBUTE OF THE NEWLY CREATED DISH TYPE RECORD


   IF ALREADY EXISTS STORE THE ID OF THE RECORD IN A VARIABLE EVERY TIME AND INSERT THE DISH TYPE HAVING DISH NAME ID

   HANDLE THE ERRORS
   */


};

