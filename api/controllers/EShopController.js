/**
 * Created by RMMHK on 9/4/2016.
 */
module.exports={


  e_create: function (req,res,next) {

    EShop.create({ES_REG_DATE:new Date()}).then(function (err,shop) {
      if(err) res.json({msg:'error'});
    User.update({id:req.param('id')},{EShop:shop.id}).then(function (ok,err)
      {
        if(ok) res.json({CustomerDetails:ok, ShopDetails: ok.EShop})
        if(err) res.json({msg:'CANNOT ASSIGN TWO SHOPS TO ONE CUSTOMERS'})
      })


  })
  },



  e_delete:function (req,res,next){

    EShop.destroy('57cd1352b1efe2f40dff3eff').then(function (err){
      if (err) {
        return res.negotiate(err);
      }
      res.redirect('/eshop')


    });

  },
  };
