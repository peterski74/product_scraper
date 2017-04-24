var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  // Let's scrape Anchorman 2
  //url = 'http://www.imdb.com/title/tt1229340/';
  //url='https://www.flipkart.com/moto-g5-plus-lunar-grey-32-gb/p/itmes2zjvwfncxxr?pid=MOBEQHMGMAUXS5BF&srno=b_1_1&otracker=clp_banner_1_2.bannerX3.BANNER_mobiles_2f9856a6-b945-4e66-ab9c-bcc044287aef_wp1&lid=LSTMOBEQHMGMAUXS5BFVCF0ZO'
  //url='https://www.flipkart.com/moto-g5-plus-fine-gold-32-gb/p/itmes2zjvwfncxxr?pid=MOBEQHMGMAUXS5BF&srno=b_1_1&otracker=clp_banner_1_2.bannerX3.BANNER_mobiles_2f9856a6-b945-4e66-ab9c-bcc044287aef_wp1&lid=LSTMOBEQHMGMAUXS5BFVCF0ZO'
  //url='https://www.flipkart.com/moto-e3-power-black-16-gb/p/itmekgt2fbywqgcv?pid=MOBEKGT2HGDGADFW&srno=b_1_1&otracker=product_breadCrumbs_Motorola%20Mobiles&lid=LSTMOBEKGT2HGDGADFWP5NHBY';
  url='https://www.flipkart.com/redmi-note-4-gold-64-gb/p/itmeqg86fjyzkdq8?pid=MOBEQ98MNXHY4RU9&srno=b_1_1&otracker=product_breadCrumbs_Mobiles&lid=LSTMOBEQ98MNXHY4RU9XEFSBA';
var dataOut = {};
var prodBrand = '';
var prodCategory = '';
var prodSubCategory = '';
var prodTitle = '';
var prodImg = '';
var prodSpecs = {};

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, release, rating;
      var json = { title : "", release : "", rating : ""};
      var trimData ={};
      var parsedData={};

        $('#is_script').filter(function(){
           var data = $(this); 
            try {
                //console.log(data.text());
                //JSON.parse(data.text());
                trimData = data.text().replace('window.__INITIAL_STATE__ =','').replace(/;/g,'');
                //console.log(trimData);
                parsedData = JSON.parse(trimData);
                dataOut = parsedData.productPage.productDetails.pageContext.pricing.prices[0].value;
                prodBrand = parsedData.productPage.productDetails.pageContext.brand;
                prodCategory = parsedData.productPage.productDetails.pageContext.analyticsData.category;
                prodSubCategory = parsedData.productPage.productDetails.pageContext.analyticsData.subCategory;
                prodTitle = parsedData.productPage.productDetails.pageContext.titles.title;
                prodImg = parsedData.productPage.productDetails.pageContext.imageUrl.replace('{@width}','640').replace('{@height}','480').replace('{@quality}','70');
prodSpecs = parsedData.productPage.productDetails.data.product_specifications_1.data[0].value.attributes;


                console.log(dataOut);//.productDetails.data.product_summary_1.data.value);//.pricing.finalPrice.value);
                //console.log(parsedData);
                
            } catch (e) {
                console.log("not JSON\n\n" + e);
            }

           //var jsondata = JSON.parse(data.text());
           //console.log(jsondata.initialize);
        })

    //   $('.title_wrapper').filter(function(){
    //     var data = $(this);
    //     title = data.children().first().text().trim();
    //     release = data.children().last().children().last().text().trim();

    //     json.title = title;
    //     json.release = release;
    //   })

    //   $('.ratingValue').filter(function(){
    //     var data = $(this);
    //     rating = data.text().trim();

    //     json.rating = rating;
    //   })
    }
    else{
      console.log(error);   
    }

    fs.writeFile('output.json', dataOut, function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Price:' + dataOut + 
    '<br> Brand: ' + prodBrand + 
    '<br> Category: ' + prodCategory +
    '<br> SubCategory: ' + prodSubCategory + 
    '<br> Title: ' + prodTitle +
    '<br> Img <img src=' + prodImg + '>' + prodImg + 
    '<br> Prod Specs: '+ JSON.stringify(prodSpecs));

  })
})

app.listen('8082')
console.log('Magic happens on port 8082');
exports = module.exports = app;