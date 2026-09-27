let responseActions = [];

const playbooks = {
  BRUTE_FORCE: {
    name: "Brute Force Response",
    actions: [
      "BLOCK_SOURCE_IP",
      "CREATE_INVESTIGATION_TASK"
    ]
  },

  PORT_SCAN: {
    name: "Port Scan Response",
    actions: [
      "BLOCK_SOURCE_IP",
      "CREATE_INVESTIGATION_TASK"
    ]
  },

  SUSPICIOUS_PORT: {
    name: "Suspicious Port Response",
    actions: [
      "BLOCK_SOURCE_IP",
      "CREATE_INVESTIGATION_TASK"
    ]
  },

  EXTERNAL_TO_INTERNAL: {
    name: "External Access Response",
    actions: [
      "CREATE_INVESTIGATION_TASK"
    ]
  },

  HIGH_TRAFFIC_VOLUME: {
    name: "High Traffic Response",
    actions: [
      "MONITOR_SOURCE"
    ]
  }
};

function executeAction(action, context) {
  const timestamp = new Date().toISOString();

  let result;

  switch (action) {
    case "BLOCK_SOURCE_IP":
      result = {
        action,
        status: "SIMULATED",
        message: `Source IP ${context.sourceIP} would be blocked.`
      };
      break;

    case "CREATE_INVESTIGATION_TASK":
      result = {
        action,
        status: "SIMULATED",
        message: "Investigation task created for SOC analyst."
      };
      break;

    case "MONITOR_SOURCE":
      result = {
        action,
        status: "SIMULATED",
        message: `Source IP ${context.sourceIP} placed under monitoring.`
      };
      break;

    case "ISOLATE_HOST":
      result = {
        action,
        status: "SIMULATED",
        message: `Host ${context.sourceIP} would be isolated.`
      };
      break;

    default:
      result = {
        action,
        status: "FAILED",
        message: "Unknown response action."
      };
  }

  const response = {
    id: `RESP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    sourceIP: context.sourceIP || "Unknown",
    alertId: context.alertId || null,
    incidentId: context.incidentId || null,
    ...result
  };

  responseActions.unshift(response);

  return response;
}

function executePlaybook(alert, incident = null) {
  const detections = alert.detections || [];

  const results = [];

  detections.forEach(detection => {
    const playbook = playbooks[detection.rule];

    if (!playbook) {
      return;
    }

    playbook.actions.forEach(action => {
      const result = executeAction(action, {
        sourceIP: alert.sourceIP,
        destinationIP: alert.destinationIP,
        alertId: alert.id,
        incidentId: incident?.id || null
      });

      results.push({
        playbook: playbook.name,
        rule: detection.rule,
        ...result
      });
    });
  });

  return results;
}

function getResponseActions() {
  return responseActions;
}

function getPlaybooks() {
  return playbooks;
}

function clearResponseActions() {
  responseActions = [];
}

module.exports = {
  executePlaybook,
  executeAction,
  getResponseActions,
  getPlaybooks,
  clearResponseActions
};