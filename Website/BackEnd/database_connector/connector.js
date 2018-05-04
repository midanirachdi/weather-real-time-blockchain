var mongoose = require('mongoose');
var uri = "mongodb://mongo-admin:270bytes@cluster0-shard-00-00-aoxkb.mongodb.net:27017,cluster0-shard-00-01-aoxkb.mongodb.net:27017,cluster0-shard-00-02-aoxkb.mongodb.net:27017/weather?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

mongoose.connect(uri);
