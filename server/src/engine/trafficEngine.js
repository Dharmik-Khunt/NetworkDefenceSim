const devices = require("../network");
const trafficProfiles = require("./trafficProfiles");

function randomItem(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}

function randomNumber(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  );
}

function findDeviceByIP(ip) {

  return devices.find(
    device => device.ip === ip
  );

}

function generateTrafficEvent() {

  const profile = randomItem(trafficProfiles);

  const sourceIP = randomItem(
    profile.sources
  );

  const destinationIP = randomItem(
    profile.destinations
  );

  const sourceDevice =
    findDeviceByIP(sourceIP);

  const destinationDevice =
    findDeviceByIP(destinationIP);

  return {

    id:
      `evt-${Date.now()}-${randomNumber(1000, 9999)}`,

    timestamp:
      new Date().toISOString(),

    profile:
      profile.name,

    sourceIP,

    sourceDevice:
      sourceDevice?.name || "Unknown",

    destinationIP,

    destinationDevice:
      destinationDevice?.name || "Unknown",

    protocol:
      profile.protocol,

    destinationPort:
      profile.port,

    service:
      profile.service,

    bytes:
      randomNumber(100, 10000),

    packets:
      randomNumber(1, 50),

    action:
      "ALLOW"

  };

}

module.exports = {
  generateTrafficEvent
};