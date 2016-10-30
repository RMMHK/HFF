/**
 * Created by RMMHK on 9/4/2016.
 */
module.exports={


getEShop:function (req,res,next) {

  //parameters user  id

  var params = req.body

  User.findOne({id: params.id}.populate('EShop')).then(function (user,err) {

    if(user.EShop!=""&&user.EShop.ES_BLOCK==false)
    {

        EShop.find({id:user.EShop.id}.populate('ES_Shopitems')).then(function (items,err) {

         if (items)
        res.json({status:1,shop_status:user.EShop.ES_STATUS,items:items})

          if(err)
          {
            res.json({status:0})
          }
       })
    }

    else if(user.EShop=="")
    {

      EShop.create({ES_REG_DATE:new Date()}).then(function (shop,err) {

        if(err)
          res.json({status:0,tag:"CEShop"});

        else if(shop)
        {
          User.update({id:params.id},{EShop:shop.id}).then(function (ok,err)
          {

             if(ok)
             {
              EShop.find({id:shop.id}.populate('ES_Shopitems')).then(function (items,err) {
              if (items)
                res.json({status:1,shop_status:user.EShop.ES_STATUS,items:items})

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


    else if (user.EShop!=""&&user.EShop.ES_BLOCK==true)
    {
      res.json({status:-1})
    }


    else if(err)
    {
      res.json({status:0})
    }
  })


},



};
