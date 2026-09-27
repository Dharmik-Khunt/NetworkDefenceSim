const express = require("express");
const cors = require("cors");

const {
  startScenario,
  stopScenario,
  getScenarioStatus,
  getScenarioEvents,
  getScenarioAlerts
} = require("./src/scenarios/scenarioEngine");

const {
  startSimulation,
  stopSimulation,
  getSimulationStatus,
  getTrafficEvents,
  getAlerts
} = require("./src/engine/simulationEngine");

const {
  generateTrafficEvent
} = require("./src/engine/trafficEngine");

const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  addIncidentNote,
  addRelatedAlert,
  resolveIncident
} = require("./src/incidents/incidentManager");

const {
  executePlaybook,
  getResponseActions,
  getPlaybooks
} = require("./src/response/playbookEngine");

const {
  buildAnalytics
} = require("./src/analytics/analyticsEngine");

const app = express();

const PORT = 5000;


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// BASIC API
// ===============================

app.get("/", (req, res) => {

  res.json({
    message: "Network Defense Simulation API",
    status: "online"
  });

});


// ===============================
// TRAFFIC TEST
// ===============================

app.get("/api/traffic/test", (req, res) => {

  const event =
    generateTrafficEvent();

  res.json(event);

});


// ===============================
// TRAFFIC
// ===============================

app.get("/api/traffic", (req, res) => {

  res.json(
    getTrafficEvents()
  );

});


// ===============================
// SIMULATION START
// ===============================

app.post("/api/simulation/start", (req, res) => {

  startSimulation();

  res.json({

    message:
      "Simulation started",

    status:
      getSimulationStatus()

  });

});


// ===============================
// SIMULATION STOP
// ===============================

app.post("/api/simulation/stop", (req, res) => {

  stopSimulation();

  res.json({

    message:
      "Simulation stopped",

    status:
      getSimulationStatus()

  });

});


// ===============================
// SIMULATION STATUS
// ===============================

app.get("/api/simulation/status", (req, res) => {

  res.json(
    getSimulationStatus()
  );

});


// ===============================
// ALERTS
// ===============================

app.get("/api/alerts", (req, res) => {

  const simulationAlerts =
    getAlerts();

  const scenarioAlerts =
    getScenarioAlerts();

  const combinedAlerts = [

    ...simulationAlerts,

    ...scenarioAlerts

  ];

  res.json(
    combinedAlerts
  );

});


// ===============================
// EVENTS / SIEM LOGS
// ===============================

app.get("/api/events", (req, res) => {

  try {

    const simulationEvents =
      getTrafficEvents();

    const scenarioEvents =
      getScenarioEvents();

    const combinedEvents = [

      ...simulationEvents,

      ...scenarioEvents

    ];

    res.json(
      combinedEvents
    );

  }
  catch (error) {

    console.error(
      "Failed to retrieve events:",
      error
    );

    res.status(500).json({

      error:
        "Failed to retrieve events"

    });

  }

});


// ===============================
// DETECTION STATISTICS
// ===============================

app.get("/api/detection/stats", (req, res) => {

  try {

    const events =
      getTrafficEvents();

    const scenarioEvents =
      getScenarioEvents();

    const simulationAlerts =
      getAlerts();

    const scenarioAlerts =
      getScenarioAlerts();


    const allEvents = [

      ...events,

      ...scenarioEvents

    ];


    const allAlerts = [

      ...simulationAlerts,

      ...scenarioAlerts

    ];


    const ruleCounts = {};


    allAlerts.forEach(
      (alert) => {

        if (
          !alert.detections
        ) {
          return;
        }


        alert.detections.forEach(
          (detection) => {

            const rule =
              detection.rule ||
              "UNKNOWN";


            ruleCounts[rule] =
              (ruleCounts[rule] || 0) + 1;

          }
        );

      }
    );


    res.json({

      totalEvents:
        allEvents.length,

      totalAlerts:
        allAlerts.length,

      detectionRules:
        ruleCounts

    });

  }
  catch (error) {

    console.error(
      "Failed to calculate detection statistics:",
      error
    );

    res.status(500).json({

      error:
        "Failed to calculate detection statistics"

    });

  }

});


// ===============================
// SCENARIO START
// ===============================

app.post("/api/scenario/start", (req, res) => {

  try {

    const {
      scenario
    } = req.body;


    startScenario(
      scenario
    );


    res.json({

      message:
        "Scenario started",

      status:
        getScenarioStatus()

    });

  }
  catch (error) {

    res.status(400).json({

      error:
        error.message

    });

  }

});


// ===============================
// SCENARIO STOP
// ===============================

app.post("/api/scenario/stop", (req, res) => {

  stopScenario();

  res.json({

    message:
      "Scenario stopped",

    status:
      getScenarioStatus()

  });

});


// ===============================
// SCENARIO STATUS
// ===============================

app.get("/api/scenario/status", (req, res) => {

  res.json(
    getScenarioStatus()
  );

});


// ===============================
// SCENARIO EVENTS
// ===============================

app.get("/api/scenario/events", (req, res) => {

  res.json(
    getScenarioEvents()
  );

});


// ===============================
// SCENARIO ALERTS
// ===============================

app.get("/api/scenario/alerts", (req, res) => {

  res.json(
    getScenarioAlerts()
  );

});

// ===============================
// CREATE INCIDENT
// ===============================

app.post("/api/incidents", (req, res) => {

  try {

    const {
      alertId
    } = req.body;


    const simulationAlerts =
      getAlerts();

    const scenarioAlerts =
      getScenarioAlerts();


    const allAlerts = [

      ...simulationAlerts,

      ...scenarioAlerts

    ];


    const alert =
      allAlerts.find(
        item =>
          String(item.id) ===
          String(alertId)
      );


    if (!alert) {

      return res.status(404).json({

        error:
          "Alert not found"

      });

    }


    const incident =
      createIncident(alert);


    res.status(201).json(
      incident
    );

  }
  catch (error) {

    console.error(
      "Failed to create incident:",
      error
    );


    res.status(500).json({

      error:
        "Failed to create incident"

    });

  }

});

// ===============================
// GET INCIDENTS
// ===============================

app.get("/api/incidents", (req, res) => {

  res.json(
    getIncidents()
  );

});

// ===============================
// GET INCIDENT BY ID
// ===============================

app.get(
  "/api/incidents/:id",
  (req, res) => {

    const incident =
      getIncidentById(
        req.params.id
      );


    if (!incident) {

      return res.status(404).json({

        error:
          "Incident not found"

      });

    }


    res.json(
      incident
    );

  }
);

// ===============================
// UPDATE INCIDENT
// ===============================

app.patch(
  "/api/incidents/:id",
  (req, res) => {

    const incident =
      updateIncident(
        req.params.id,
        req.body
      );


    if (!incident) {

      return res.status(404).json({

        error:
          "Incident not found"

      });

    }


    res.json(
      incident
    );

  }
);

// ===============================
// ADD INCIDENT NOTE
// ===============================

app.post(
  "/api/incidents/:id/notes",
  (req, res) => {

    const {
      note,
      analyst
    } = req.body;


    if (!note) {

      return res.status(400).json({

        error:
          "Note is required"

      });

    }


    const incident =
      addIncidentNote(
        req.params.id,
        note,
        analyst
      );


    if (!incident) {

      return res.status(404).json({

        error:
          "Incident not found"

      });

    }


    res.json(
      incident
    );

  }
);

// ===============================
// LINK ALERT TO INCIDENT
// ===============================

app.post(
  "/api/incidents/:id/alerts",
  (req, res) => {

    const {
      alertId
    } = req.body;


    if (!alertId) {

      return res.status(400).json({

        error:
          "Alert ID is required"

      });

    }


    const incident =
      addRelatedAlert(
        req.params.id,
        alertId
      );


    if (!incident) {

      return res.status(404).json({

        error:
          "Incident not found"

      });

    }


    res.json(
      incident
    );

  }
);

// ===============================
// RESOLVE INCIDENT
// ===============================

app.post(
  "/api/incidents/:id/resolve",
  (req, res) => {

    const {
      resolution,
      analyst
    } = req.body;


    if (!resolution) {

      return res.status(400).json({

        error:
          "Resolution is required"

      });

    }


    const incident =
      resolveIncident(
        req.params.id,
        resolution,
        analyst
      );


    if (!incident) {

      return res.status(404).json({

        error:
          "Incident not found"

      });

    }


    res.json(
      incident
    );

  }
);

app.get("/api/response/playbooks", (req, res) => {
  res.json(getPlaybooks());
});
app.get("/api/response/actions", (req, res) => {
  res.json(getResponseActions());
});

app.post("/api/response/execute", (req, res) => {
  const { alertId, incidentId } = req.body;

  const simulationAlerts = getAlerts();
  const scenarioAlerts = getScenarioAlerts();

  const allAlerts = [
    ...simulationAlerts,
    ...scenarioAlerts
  ];

  const alert = allAlerts.find(
    item => item.id === alertId
  );

  if (!alert) {
    return res.status(404).json({
      error: "Alert not found"
    });
  }

  const results = executePlaybook(
    alert,
    incidentId ? { id: incidentId } : null
  );

  res.json({
    alertId,
    incidentId: incidentId || null,
    results
  });
});

app.get("/api/analytics", (req, res) => {
  const simulationAlerts = getAlerts();
  const scenarioAlerts = getScenarioAlerts();

  const simulationEvents = getTrafficEvents();
  const scenarioEvents = getScenarioEvents();

  const alerts = [
    ...simulationAlerts,
    ...scenarioAlerts
  ];

  const events = [
    ...simulationEvents,
    ...scenarioEvents
  ];

  const incidents = getIncidents();

  const responseActions =
    getResponseActions();

  const analytics = buildAnalytics({
    alerts,
    incidents,
    events,
    responseActions
  });

  res.json(analytics);
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

  console.log(
    `Network Defense API running on http://localhost:${PORT}`
  );

});