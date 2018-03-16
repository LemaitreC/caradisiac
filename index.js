
const elasticsearch = require('elasticsearch');
const pReflect = require('p-reflect');
const pMap = require('p-map');
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');

function index(){
  getBrands().then(res=>{
   let promises=[]

   for(var i=0;i<2;i++){
     console.log(res[i])
     promises.push(getModels(res[i]))
   }
  //  console.log("Test")
  return pMap(promises, pReflect,{concurrency:2})
  }).then(res=>{
    const f = res.filter(x => x.isFulfilled).map(x => x.value);
    const r = res.filter(x => x.isRejected).map(x => x.value);
    console.log(f)
    console.log("rejected :" +r.length)
  }).catch(err=>{
    console.log(err)
  })
}

index()


function fetchModels(brand){
  return new Promise(function(resolve,reject){
    getModels(brand).then(res=>{
      // let newRes = []
      // for(var i=0; i<res.length;i++){
      //   if(res.length != 0) newRes.push(res[i])
      // }

      resolve(res)
    }).catch(err=>{
      reject(err)
    })
  })
}

// getModels('PEUGEOT').then(res=>{
//   console.log(res)
// }).catch(err=>{
//   console.log(err)
// })

// var client = new elasticsearch.Client({
//   host: 'localhost:9200',
//   log: 'trace'
// });
//
// client.ping({
//   // ping usually has a 3000ms timeout
//   requestTimeout: 1000
// }, function (error) {
//   if (error) {
//     console.trace('elasticsearch cluster is down!');
//   } else {
//     console.log('All is well');
//   }
// });
//
// var body = [];
// for (var i = 0; i < stocks.length; i++ ) {
//     delete stocks[i]._id;
//     var config = { index:  { _index: 'stocks', _type: 'stock', _id: i } };
//     body.push(config);
//     body.push(stocks[i]);
// }
//
// client.bulk({
//     body: body
// }, function (error, response) {
//     if (error) {
//         console.error(error);
//         return;
//     }
//     else {
//         console.log(response);  //  I don't recommend this but I like having my console flooded with stuff.  It looks cool.  Like I'm compiling a kernel really fast.
//     }
// });
