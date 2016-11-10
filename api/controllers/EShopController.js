/**
 * Created by RMMHK on 9/4/2016.
 */
module.exports={


getEShop:function (req,res,next) {

  //parameters user  id

  var params = req.body
  console.log(params)

  User.findOne({id: params.id}).populate('EShop').then(function (user,err) {

    try{
    if(user.EShop!=""&&user.EShop.ES_BLOCK==false)
    {
                                                                                         //needs to fastt
        EShop.findOne({id:user.EShop.id}).populate('ES_items').then(function (items,err) {

         if (items)
        res.json({status:1,eshop_id:user.EShop.id,eshop_status:user.EShop.ES_STATUS,items:items.ES_items})

          if(err)
          {
            res.json({status:0})
          }
       })
    }
    else if (user.EShop!=""&&user.EShop.ES_BLOCK==true)
      {
        res.json({status:-1,tag:"Blocked"})
      }

    else if(err)
        {res.json({status:0})}
    }

    catch (exception)
    {

      EShop.create({ES_REG_DATE:new Date()}).then(function (shop,err) {

        if(err)
          res.json({status:0,tag:"CEShop"});

        else if(shop)
        console.log(shop)
        {
          User.update({id:params.id},{EShop:shop.id,eshop_id:shop.id}).then(function (ok,err)
          {

             if(ok)
             {
               console.log(ok)
               //needs to fast
              EShop.findOne({id:shop.id}).populate('ES_items').then(function (items,err) {
              if (items)
                res.json({status:1,eshop_id:shop.id,eshop_status:shop.ES_STATUS,items:items.ES_items}) //returning items

              if(err)
              {
                res.json({status:0,tag:"FEShop"})
              }
            })
             }

             else if (err)
             {
               res.json({status:0,tag:"UUser"})
             }

          })


        }})}


  })


},

  shopStatus:function (req,res,next) {
      var params = req.body;

      EShop.update({id:params.id},{ES_STATUS:params.status}).then(function(data,err){

        var params = req.body;
        console.log(params.v_id);

        if (err)
        {
          res.json({status: 0});
          // console.log("err"+o);
        }
        else if (data==""||!data)
        {res.json({status: 0});}

        else if (data)
        {  res.json({status:1,eshop_status:data[0].ES_STATUS})
        }
      })


    },

};
