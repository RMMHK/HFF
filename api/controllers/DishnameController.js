/**
 * DishnameController
 *
 * @description :: Server-side logic for managing dishnames
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  dishOperations:function (req,res,next) {


    var params = req.body;
    var dishTypeFullName=params.dishType + params.dishName+"";
    console.log(params)
    console.log(dishTypeFullName)

    Dishname.findOne({DishName:params.dishName}).then(function(data,err) {

      if (data && data != "" && !data.undefined)
      {

        var dish_id = data.id;

        Dishtype.findOne({dishType:dishTypeFullName}).then(function (data,err) {
          if (data && data != "" && !data.undefined)
          {
            res.json({type: "Entered Food Type  Already Exists"})
          }
          else
          {
            Dishtype.create({dishType: dishTypeFullName, single_name:params.dishType,joint: dish_id}).then(function (data, err) {
              if (data && data != "" && !data.undefined)
              {
                HashTable.create({foodTypeName:data.dishType,foodTypeId:data.id}).then(function (data,err) {
                  res.json({type: "Type created and hash table updated"})

                })
              }
              else if (err)
                res.json({type: "Error while entering type in hash table"})

            })
          }
        })
      }


      else if(!data||data=="")
     {
       Dishname.create({DishName:params.dishName}).then(function (data,err)
       {
         if (data && data != "" && !data.undefined)
         {
           var dish_id = data.id;

           Dishtype.create({dishType: dishTypeFullName,single_name:params.dishType, joint: dish_id}).then(function (data, err) {
             if (data && data != "" && !data.undefined) {

               HashTable.create({foodTypeName: data.dishType, foodTypeId: data.id}).then(function (data, err) {

                 if (data && data != "" && !data.undefined)
                   res.json({type: "Type created and hash table updated"})
                 else
                   res.json({type: "Type created and hash table updated"})
               })
             }
               else if (err)
               res.json({type: "TYPE - not inserted"})
           })
         }
      else if (err)
      {
        res.json({type: "DISH NAME - not inserted"})
      }
    })}


    else if (err)
      {
        res.json({type: "Unable to find dishes"})
      }

    })

    }
};

