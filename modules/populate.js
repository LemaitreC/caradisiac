
const elasticsearch = require('elasticsearch');
const pReflect = require('p-reflect');
const pMap = require('p-map');
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');

exports.addCars = callback =>{
  getBrands().then(res=>{
   let promises=[]

   for(var i=0;i<5;i++){
     promises.push(getModels(res[i]))
   }
  return pMap(promises, pReflect,{concurrency:2})
  }).then(res=>{
    const results = res.filter(x => x.isFulfilled).map(x => x.value);
    const r = res.filter(x => x.isRejected).map(x => x.value);
    let models=[]


    for(var i=0 ; i<results.length;i++){
      for(var j = 0 ; j<results[i].length; j++){
        if(parseInt(results[i][j].volume)) {
          results[i][j].volume = parseInt(results[i][j].volume)
        }
        else{
          results[i][j].volume = 0
        }
        models.push(results[i][j])
      }
    }

    return elasticsearchBulk(models)
  }).then(()=>{
     callback(null,"The models were inserted properly")
  }).catch(err=>{
    callback(err)
  })
}

function elasticsearchBulk(models){
  let bulkBody = [];
  models.forEach(item => {
    bulkBody.push({
      index: {
        _index: "cars",
        _type: "car",
        _id: item.uuid
      }
    });

    bulkBody.push(item);
  });

  var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });

  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });

  client.bulk({
      body: bulkBody
  }, function (error, response) {
      if (error) {
          console.error(error);
          return;
      }
  });

}
