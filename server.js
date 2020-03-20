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

app.post('/start', async (req, res) => {
  let response;
  try {
    await client.enterPin()
    response = await vehicle.start({
      airCtrl: true,
      igniOnDuration: 10,
      airTempvalue: 60
    });
  } catch (e) {
    response = {
      error: e.message
    };
  }
  res.send(response);
});

app.post('/lock', async (req, res) => {
  let response;
  try {
    await client.enterPin()
    response = await vehicle.lock();
  } catch (e) {
    console.log(e);
    response = {
      error: e.message
    };
  }
  res.send(response);
});

app.post('/status', async (req, res) => {
  let response;
  try {
    await client.enterPin()
    response = await vehicle.status();
  } catch (e) {
    console.log(e);
    response = {
      error: e.message
    };
  }
  res.send(response);
});

// Home Assistant Sensor Integration
app.get('/hass', async (req, res) => {
  await checkPin();
  await myVehicles[0].update();
  const v = myVehicles[0];
  res.json({
      airCtrlOn: v.status.airCtrlOn,
      latitude: v.location.coord.lat,
      longitude: v.location.coord.lon,
      altitude: v.location.coord.alt,
      speed: v.location.speed.value,
      doorsLocked: v.status.doorLock,
      hoodOpen: v.status.hoodOpen,
      steerWheelHeat: v.status.steerWheelHeat === 1,
      doorOpenFrontLeft: v.status.doorOpen.frontLeft === 1,
      doorOpenFrontRight: v.status.doorOpen.frontRight === 1,
      doorOpenBackLeft: v.status.doorOpen.backLeft === 1,
      doorOpenBackRight: v.status.doorOpen.backRight === 1,
      trunkOpen: v.status.trunkOpen,
      airTemp: v.status.airTemp.value,
      defrost: v.status.defrost,
      batteryCharge: v.status.evStatus.batteryCharge,
      batteryStatus: checkAndSetCharge(v.status.evStatus.batteryStatus),
      timeToFullCharge: v.status.evStatus.remainTime2[Object.keys(v.status.evStatus.remainTime2)[v.status.evStatus.batteryPlugin]].value,
      drivingDistance: v.status.evStatus.drvDistance[0].rangeByFuel.totalAvailableRange.value,
      tirePressureLampAll: v.status.tirePressureLamp.tirePressureLampAll === 1,
      tirePressureLampFL: v.status.tirePressureLamp.tirePressureLampFL === 1,
      tirePressureLampFR: v.status.tirePressureLamp.tirePressureLampFR === 1,
      tirePressureLampRL: v.status.tirePressureLamp.tirePressureLampRL === 1,
      tirePressureLampRR: v.status.tirePressureLamp.tirePressureLampFR === 1,
      odometer: v.odometer.value,
      name: myVehicles[0].name
  });
});

app.listen(8080, '0.0.0.0');