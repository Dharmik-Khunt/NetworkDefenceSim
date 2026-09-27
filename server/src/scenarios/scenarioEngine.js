const scenarioProfiles =
  require("./scenarioProfiles");

const {
  analyzeEvent
} = require("../detection/detectionEngine");


let currentScenario = "normal";

let scenarioRunning = false;

let scenarioInterval = null;

let scenarioEvents = [];

let scenarioAlerts = [];


function randomNumber(min, max) {

  return Math.floor(
    Math.random() * (max - min + 1) + min
  );

}


function createEvent(data) {

  return {

    id:
      `scenario-${Date.now()}-${randomNumber(1000, 9999)}`,

    timestamp:
      new Date().toISOString(),

    ...data

  };

}


function generateNormalEvent() {

  return createEvent({

    sourceIP:
      randomNumber(101, 102) === 101
        ? "10.0.0.101"
        : "10.0.0.102",

    sourceDevice:
      "Employee Workstation",

    destinationIP:
      "10.0.0.10",

    destinationDevice:
      "Web Server",

    protocol:
      "TCP",

    destinationPort:
      443,

    service:
      "HTTPS",

    bytes:
      randomNumber(500, 5000),

    packets:
      randomNumber(5, 30),

    action:
      "ALLOW"

  });

}


function generatePortScanEvent() {

  const ports = [
    21,
    22,
    23,
    25,
    53,
    80,
    110,
    139,
    443,
    445,
    3389
  ];

  const port =
    ports[
      randomNumber(0, ports.length - 1)
    ];

  return createEvent({

    sourceIP:
      "203.0.113.50",

    sourceDevice:
      "External Host",

    destinationIP:
      "10.0.0.10",

    destinationDevice:
      "Web Server",

    protocol:
      "TCP",

    destinationPort:
      port,

    service:
      "Port Probe",

    bytes:
      randomNumber(60, 300),

    packets:
      randomNumber(1, 3),

    action:
      "BLOCK"

  });

}


function generateBruteForceEvent() {

  return createEvent({

    sourceIP:
      "203.0.113.60",

    sourceDevice:
      "External Host",

    destinationIP:
      "10.0.0.30",

    destinationDevice:
      "VPN Server",

    protocol:
      "TCP",

    destinationPort:
      22,

    service:
      "SSH",

    bytes:
      randomNumber(100, 500),

    packets:
      randomNumber(1, 5),

    action:
      "BLOCK"

  });

}


function generateExfiltrationEvent() {

  return createEvent({

    sourceIP:
      "10.0.0.20",

    sourceDevice:
      "Database",

    destinationIP:
      "198.51.100.50",

    destinationDevice:
      "External Host",

    protocol:
      "TCP",

    destinationPort:
      443,

    service:
      "HTTPS",

    bytes:
      randomNumber(15000, 50000),

    packets:
      randomNumber(100, 500),

    action:
      "MONITOR"

  });

}


function generateScenarioEvent() {

  switch (currentScenario) {

    case "portScan":
      return generatePortScanEvent();

    case "bruteForce":
      return generateBruteForceEvent();

    case "dataExfiltration":
      return generateExfiltrationEvent();

    case "mixedAttack":

      const random =
        randomNumber(1, 3);

      if (random === 1) {
        return generatePortScanEvent();
      }

      if (random === 2) {
        return generateBruteForceEvent();
      }

      return generateExfiltrationEvent();

    default:
      return generateNormalEvent();

  }

}


function startScenario(name) {

  if (
    !scenarioProfiles[name]
  ) {

    throw new Error(
      "Unknown scenario"
    );

  }


  stopScenario();


  currentScenario = name;

  scenarioRunning = true;

  scenarioEvents = [];

  scenarioAlerts = [];


  console.log(
    `Scenario started: ${scenarioProfiles[name].name}`
  );


  scenarioInterval =
    setInterval(() => {

      const event =
        generateScenarioEvent();


      const analysis =
        analyzeEvent(
          scenarioEvents,
          event
        );


      scenarioEvents.push(event);


      if (
        analysis.detections.length > 0
      ) {

scenarioAlerts.push({

  id:
    `scenario-alert-${Date.now()}`,

  timestamp:
    event.timestamp,

  scenario:
    currentScenario,

  sourceIP:
    event.sourceIP,

  destinationIP:
    event.destinationIP,

  destinationPort:
    event.destinationPort,

  protocol:
    event.protocol,

  service:
    event.service,

  action:
    event.action,

  risk:
    analysis.risk,

  detections:
    analysis.detections,

  correlations:
    analysis.correlations || [],

  status:
    "OPEN"

});


        console.log(
          `🚨 ${analysis.risk.level} ALERT | ${analysis.risk.score}`
        );

      }


      if (
        scenarioEvents.length > 500
      ) {

        scenarioEvents.shift();

      }


      if (
        scenarioAlerts.length > 100
      ) {

        scenarioAlerts.shift();

      }

    }, 1000);

}


function stopScenario() {

  if (scenarioInterval) {

    clearInterval(
      scenarioInterval
    );

  }

  scenarioInterval = null;

  scenarioRunning = false;

}


function getScenarioStatus() {

  return {

    running:
      scenarioRunning,

    scenario:
      currentScenario,

    name:
      scenarioProfiles[currentScenario]?.name,

    totalEvents:
      scenarioEvents.length,

    totalAlerts:
      scenarioAlerts.length

  };

}


function getScenarioEvents() {

  return scenarioEvents;

}


function getScenarioAlerts() {

  return scenarioAlerts;

}


module.exports = {

  startScenario,

  stopScenario,

  getScenarioStatus,

  getScenarioEvents,

  getScenarioAlerts

};