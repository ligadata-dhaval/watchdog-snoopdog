var bodyParser = require('body-parser')
var cors = require('cors')
var express = require('express'),
    appliances = require('./routes/appliances');
    devices = require('./routes/devices');
    //users=require('./routes/users');

var cors = require('cors')
var app = express();
// parse application/json
app.use(bodyParser.json())
app.use(cors())
app.options('*', cors());

app.get('/appliances', appliances.findAll);
app.get('/appliances/:userId', appliances.find);
app.delete('/appliances/:userid/:id', appliances.deleteApp);
app.post('/appliances', appliances.addApp);
app.put('/appliances/:userid/:id',appliances.updateApp);
app.listen(4000);


//cassandra services
app.post('/devices', devices.addDeviceData);
app.get('/devices/:channel', devices.getDeviceData);
app.post('/devices/health', devices.getDeviceHealth)
app.get('/devices/getOverallUsage/:deviceType/:deviceId/', devices.getOverallUsage);
app.get('/devices/weeklyUsage/:deviceType/:deviceId/', devices.getWeeklyUsage);
app.get('/devices/getRangeDataUsage/:deviceType/:deviceId/', devices.getDateUsage);


console.log('Listening on port 4000...');