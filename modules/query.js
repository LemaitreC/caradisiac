const elasticsearch = require('elasticsearch');
const pReflect = require('p-reflect');
const pMap = require('p-map');

exports.getSuv= callback=>{
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
client.search({
  index: 'cars',
  type: 'car',
  sort:"volume:desc",
  size:500
}).then(function (body) {
  var hits = body.hits.hits;
  callback(null, hits)
}, function (error) {
  console.trace(error.message);
  callback(err)
});
}
