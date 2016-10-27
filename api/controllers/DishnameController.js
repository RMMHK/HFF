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


    Dishname.findOne({DishName:params.dishName}).then(function(data,err) {
      if (data && data != "" && !data.undefined) {

        var dish_id = data.id;
        console.log("**DSHHHHHH**" + dish_id);
        Dishtype.create({dishType: params.dishType, joint: dish_id}).then(function (data, err) {
          if (data && data != "" && !data.undefined) {
            res.json({type: "inserted"})
          }
          else if (err)
            res.json({type: "not inserted"})

        })
      }

       else if(!data||data=="")
     {
       Dishname.create({DishName:params.dishName}).then(function (data,err) {

         if (data && data != "" && !data.undefined)
         {
           var dish_id = data.id;

           Dishtype.create({dishType: params.dishType, joint: dish_id}).then(function (data, err) {
             if (data && data != "" && !data.undefined) {
               res.json({type: "Data inserted"})
             }
             else if (err)
               res.json({type: "Data - not inserted"})

           })
         }
           else if(err!=null)
           res.json({err:err})
       })}

       else if (err)
      {res.json({err:err})}

     }
   )}



  /*
   Dishtype.create({dishType: params.dishType, joint: '580f204a1ccc5c0300ceddd6'}).then(function (err, data) {
   if (data && data != "" && !data.undefined) {
   res.json({type: "inserted"})
   }
   else
   res.json({type: "not inserted"})

   })}*/




//stop inserting duplicate data





   /* Dishname.create({dishName:params.dishName}).then(function (err,data) {

      if (!err)
        res.json({data})
     else if(err!=null)
        res.json({err:err})
     else if (data)
        res.json({data:data})
    })},

    undo:function (req,res,next) {

      Dishname.destroy({}).then(function (err,data) {

        if (!err)
          res.json({data})
        if(err)
          res.json({err:err})

      })

    },



  /*TAKE THE DISH NAME FIND IT AND IF EXIST SAVE ITS ID IN A VARIABLE AND THEN CREATE A TYPE AND PUT
   THE ID OF THE DISH NAME IN JOINT ATTRITBUTE OF THE NEWLY CREATED DISH TYPE RECORD


   IF ALREADY EXISTS STORE THE ID OF THE RECORD IN A VARIABLE EVERY TIME AND INSERT THE DISH TYPE HAVING DISH NAME ID

   HANDLE THE ERRORS
   */


};

