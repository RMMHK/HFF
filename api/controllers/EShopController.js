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
        res.json({status:1,eshop_id:user.EShop.id,eshop_status:user.EShop.ES_STATUS,eshop_location:user.EShop.ES_LOCATION,items:items.ES_items})

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

      EShop.create({ES_REG_DATE:new Date(),ES_OWNER_REAL_ID:params.id}).then(function (shop,err) {

        if(err)
          res.json({status:0,tag:"CEShop"});

        else if(shop)
        console.log(shop)
        {
          User.update({id:params.id},{EShop:shop.id,eshop_id:shop.id,shop_location:'N/A'}).then(function (ok,err)
          {

             if(ok)
             {
               console.log(ok)
               //needs to fast
              EShop.findOne({id:shop.id}).populate('ES_items').then(function (items,err) {
              if (items)
                res.json({status:1,eshop_id:shop.id,eshop_status:shop.ES_STATUS,eshop_location:shop.ES_LOCATION,items:items.ES_items}) //returning items

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




setLocation:function (req,res,next) {


      //user real id
  // eshop real id
  //shop location
      var params = req.body;

   var shop_id = params.shop_id
    var lat= params.shop_lat
    var long = params.shop_long
    console.log(params)
  get_shop_location(parseFloat(lat),parseFloat(long),function (location,err) {
    if(location)
    {

      EShop.update({id:shop_id},{ES_LOCATION:location,ES_LAT:lat,ES_LONG:long}).then(function (updated,err){

        if (updated[0]) {
          console.log(location)
            res.json({location:location})
        }
        else if(err)
        {
          res.json({location:-1})
        }

      });
    }
    else if(err)
    {

      res.json({location:-1})
    }
  })

  },




};
function get_shop_location (lat,long,callback) {
  var address
  var error= "N/A"
  var geo_coder= require("geocoder");

  geo_coder.reverseGeocode(lat,long,function (err,location) {

    if(location) {

      results = location.results;

      for (i = 0; i < 2; i++) {
        var obj = results[i];
        if (i == 0) {
          street = obj.formatted_address

        }
        if (i == 1) {
          sector_array = obj.address_components
          sector = sector_array[0].long_name
        }
      }
      address = sector+","+street;
      console.log(address+"")

      return callback(address,"");
    }

    if (err)
    {
      return callback(address,error)
    }
  })

}
