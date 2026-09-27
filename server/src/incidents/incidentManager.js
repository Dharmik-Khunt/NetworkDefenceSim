let incidents = [];


// =========================================
// CREATE INCIDENT
// =========================================

function createIncident(alert) {

  const incident = {

    id:
      `INC-${Date.now()}`,

    title:
      alert.title ||
      alert.message ||
      "Security Incident",

    description:
      alert.message ||
      "Security event requires investigation.",

    severity:
      alert.risk?.level ||
      alert.severity ||
      "MEDIUM",

    riskScore:
      alert.risk?.score ||
      alert.riskScore ||
      0,

    status:
      "OPEN",

    priority:
      getPriority(
        alert.risk?.level ||
        alert.severity
      ),

    sourceIP:
      alert.sourceIP ||
      alert.sourceIp ||
      "Unknown",

    destinationIP:
      alert.destinationIP ||
      alert.destinationIp ||
      "Unknown",

    detectionRules: (alert.detections || []).map(
  detection => detection.rule
),

mitreTechniques: (alert.detections || [])
  .filter(detection => detection.mitre)
  .map(detection => ({
    techniqueId: detection.mitre.techniqueId,
    technique: detection.mitre.technique,
    tactic: detection.mitre.tactic,
    description: detection.mitre.description
  })),

    relatedAlerts:
      [
        alert.id
      ],

    assignedTo:
      null,

    classification:
      null,

    notes:
      [],

    timeline:
      [
        {
          timestamp:
            new Date().toISOString(),

          action:
            "INCIDENT_CREATED",

          description:
            "Incident created from security alert."
        }
      ],

    resolution:
      null,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()

  };


  incidents.unshift(
    incident
  );


  return incident;

}


// =========================================
// PRIORITY
// =========================================

function getPriority(severity) {

  switch (
    String(severity || "")
      .toUpperCase()
  ) {

    case "CRITICAL":
      return "P1";

    case "HIGH":
      return "P2";

    case "MEDIUM":
      return "P3";

    case "LOW":
      return "P4";

    default:
      return "P4";

  }

}


// =========================================
// GET ALL INCIDENTS
// =========================================

function getIncidents() {

  return incidents;

}


// =========================================
// GET SINGLE INCIDENT
// =========================================

function getIncidentById(id) {

  return incidents.find(
    incident =>
      incident.id === id
  );

}


// =========================================
// UPDATE INCIDENT
// =========================================

function updateIncident(
  id,
  updates
) {

  const incident =
    getIncidentById(id);


  if (!incident) {

    return null;

  }


  Object.assign(
    incident,
    updates
  );


  incident.updatedAt =
    new Date().toISOString();


  incident.timeline.push({

    timestamp:
      new Date().toISOString(),

    action:
      "INCIDENT_UPDATED",

    description:
      "Incident information updated."

  });


  return incident;

}


// =========================================
// ADD NOTE
// =========================================

function addIncidentNote(
  id,
  note,
  analyst = "SOC Analyst"
) {

  const incident =
    getIncidentById(id);


  if (!incident) {

    return null;

  }


  const noteObject = {

    id:
      `NOTE-${Date.now()}`,

    analyst,

    note,

    timestamp:
      new Date().toISOString()

  };


  incident.notes.push(
    noteObject
  );


  incident.timeline.push({

    timestamp:
      noteObject.timestamp,

    action:
      "NOTE_ADDED",

    description:
      `${analyst} added an investigation note.`

  });


  incident.updatedAt =
    new Date().toISOString();


  return incident;

}


// =========================================
// ADD RELATED ALERT
// =========================================

function addRelatedAlert(
  id,
  alertId
) {

  const incident =
    getIncidentById(id);


  if (!incident) {

    return null;

  }


  if (
    !incident.relatedAlerts.includes(
      alertId
    )
  ) {

    incident.relatedAlerts.push(
      alertId
    );

  }


  incident.timeline.push({

    timestamp:
      new Date().toISOString(),

    action:
      "ALERT_LINKED",

    description:
      `Alert ${alertId} linked to incident.`

  });


  incident.updatedAt =
    new Date().toISOString();


  return incident;

}


// =========================================
// RESOLVE INCIDENT
// =========================================

function resolveIncident(
  id,
  resolution,
  analyst = "SOC Analyst"
) {

  const incident =
    getIncidentById(id);


  if (!incident) {

    return null;

  }


  incident.status =
    "RESOLVED";


  incident.resolution = {

    description:
      resolution,

    analyst,

    timestamp:
      new Date().toISOString()

  };


  incident.timeline.push({

    timestamp:
      new Date().toISOString(),

    action:
      "INCIDENT_RESOLVED",

    description:
      `${analyst} resolved the incident.`

  });


  incident.updatedAt =
    new Date().toISOString();


  return incident;

}


module.exports = {

  createIncident,

  getIncidents,

  getIncidentById,

  updateIncident,

  addIncidentNote,

  addRelatedAlert,

  resolveIncident

};