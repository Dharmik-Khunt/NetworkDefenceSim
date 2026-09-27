const {
  generateTrafficEvent
} = require("./trafficEngine");

const {
  analyzeEvent
} = require("../detection/detectionEngine");


let simulationInterval = null;

let simulationRunning = false;

let trafficEvents = [];

let alerts = [];


function startSimulation() {

  if (simulationRunning) {
    return;
  }

  simulationRunning = true;

  console.log(
    "Traffic simulation started."
  );


  simulationInterval =
    setInterval(() => {

      const event =
        generateTrafficEvent();


      const analysis =
        analyzeEvent(
          trafficEvents,
          event
        );


      trafficEvents.push(event);


      if (
        analysis.detections.length > 0
      ) {
const alert = {

  id:
    `alert-${Date.now()}`,

  timestamp:
    event.timestamp,

  sourceIP:
    event.sourceIP,

  destinationIP:
    event.destinationIP,

  service:
    event.service,

  protocol:
    event.protocol,

  destinationPort:
    event.destinationPort,

  action:
    event.action,

  profile:
    event.profile,

  risk:
    analysis.risk,

  detections:
    analysis.detections,

  correlations:
    analysis.correlations || [],

  eventCount:
    analysis.correlations?.length || 1,

  status:
    "OPEN"

};


        alerts.push(alert);


        console.log(
          `🚨 ALERT: ${analysis.risk.level} | Score: ${analysis.risk.score}`
        );

      }
      else {

        console.log(
          `${event.sourceIP} → ${event.destinationIP} | ${event.service}`
        );

      }


      if (
        trafficEvents.length > 500
      ) {

        trafficEvents.shift();

      }


      if (
        alerts.length > 100
      ) {

        alerts.shift();

      }

    }, 1000);

}


function stopSimulation() {

  if (!simulationRunning) {
    return;
  }

  clearInterval(
    simulationInterval
  );

  simulationInterval = null;

  simulationRunning = false;

  console.log(
    "Traffic simulation stopped."
  );

}


function getSimulationStatus() {

  return {

    running:
      simulationRunning,

    totalEvents:
      trafficEvents.length,

    totalAlerts:
      alerts.length

  };

}


function getTrafficEvents() {

  return trafficEvents;

}


function getAlerts() {

  return alerts;

}


module.exports = {

  startSimulation,

  stopSimulation,

  getSimulationStatus,

  getTrafficEvents,

  getAlerts

};