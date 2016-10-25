/**
 * DishnameController
 *
 * @description :: Server-side logic for managing dishnames
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  dishOperations:function (req,res,next) {

    var dishName=req.dish_name;
    var dishType=req.dish_type;


    Dishname.create({dish_name:dishName}).then(function (err,data) {

      if (!err)
        res.json({data})

    })}
  /*TAKE THE DISH NAME FIND IT AND IF EXIST SAVE ITS ID IN A VARIABLE AND THEN CREATE A TYPE AND PUT
   THE ID OF THE DISH NAME IN JOINT ATTRITBUTE OF THE NEWLY CREATED DISH TYPE RECORD


   IF ALREADY EXISTS STORE THE ID OF THE RECORD IN A VARIABLE EVERY TIME AND INSERT THE DISH TYPE HAVING DISH NAME ID

   HANDLE THE ERRORS
   */


};

