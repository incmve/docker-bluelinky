const express = require('express');
const BlueLinky = require('bluelinky');
const bodyParser = require('body-parser');
const config = require('/config/config.json');

const app = express();
app.use(bodyParser.json());

let vehicle;
let client;

const middleWare = async (req, res, next) => {
  const ip = req.connection.remoteAddress;
  console.log(req.path, ip);

  if (req.body.VALIDATION_KEY !== config.validation_key) {
    console.log('Bad key used by: ' + ip);
    return res.send({ error: 'bad key' });
  }

  client = new BlueLinky({ 
    username: config.username, 
    password: config.password,
    pin: config.pin,
    region: config.region,
    deviceUuid: config.deviceUuid
  });

  client.on('ready', () => {
    vehicle = client.getVehicle(config.vin);
    return next();
  });
};

app.use(middleWare);

// Start Climate at set temperature and for set period of time
app.post('/start', async (req, res) => { 
  let response;
  try {
    response = await vehicle.start({
      airCtrl: true,
      igniOnDuration: 10,
      temperature: 20.0,
      defrost: false
    });
  } catch (e) {
    response = {
      error: e.message
    };
  }
  res.send(response);
});

// Stop Climate
app.post('/stop', async (req, res) => {
  let response;
  try {
    response = await vehicle.stop();
  } catch (e) {
    console.log(e);
    response = {
      error: e.message
    };
  }
  res.send(response);
});

// Lock the Car
app.post('/lock', async (req, res) => {
  let response;
  try {
    response = await vehicle.lock();
  } catch (e) {
    console.log(e);
    response = {
      error: e.message
    };
  }
  res.send(response);
});

// Unlock the Car
app.post('/unlock', async (req, res) => {
  let response;
  try {
    response = await vehicle.unlock();
  } catch (e) {
    console.log(e);
    response = {
      error: e.message
    };
  }
  res.send(response);
});

// Query status of the Car
app.post('/status', async (req, res) => {
  let response;
  try {
    response = await vehicle.status({ refresh: false, parsed: true });
  } catch (e) {
    console.log(e);
    response = {
      error: e.message
    };
  }
  res.send(response);
});

app.listen(8080, '0.0.0.0');