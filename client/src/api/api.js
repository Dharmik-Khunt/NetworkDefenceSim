const API_BASE_URL = "http://localhost:5000/api";


export async function getTraffic() {

  const response = await fetch(
    `${API_BASE_URL}/traffic`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch traffic data");
  }

  return response.json();
}


export async function getAlerts() {

  const response = await fetch(
    `${API_BASE_URL}/alerts`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return response.json();
}


export async function getSimulationStatus() {

  const response = await fetch(
    `${API_BASE_URL}/simulation/status`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch simulation status");
  }

  return response.json();
}


export async function getScenarioStatus() {

  const response = await fetch(
    `${API_BASE_URL}/scenario/status`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch scenario status");
  }

  return response.json();
}

export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return response.json();
}

export async function getIncidents() {

  const response =
    await fetch(
      `${API_BASE_URL}/incidents`
    );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch incidents"
    );

  }


  return response.json();

}


export async function createIncident(
  alertId
) {

  const response =
    await fetch(
      `${API_BASE_URL}/incidents`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          alertId
        })
      }
    );


  if (!response.ok) {

    throw new Error(
      "Failed to create incident"
    );

  }


  return response.json();

}


export async function getIncident(
  id
) {

  const response =
    await fetch(
      `${API_BASE_URL}/incidents/${id}`
    );


  if (!response.ok) {

    throw new Error(
      "Failed to fetch incident"
    );

  }


  return response.json();

}


export async function updateIncident(
  id,
  updates
) {

  const response =
    await fetch(
      `${API_BASE_URL}/incidents/${id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(updates)

      }
    );


  if (!response.ok) {

    throw new Error(
      "Failed to update incident"
    );

  }


  return response.json();

}


export async function addIncidentNote(
  id,
  note,
  analyst = "SOC Analyst"
) {

  const response =
    await fetch(
      `${API_BASE_URL}/incidents/${id}/notes`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            note,
            analyst
          })

      }
    );


  if (!response.ok) {

    throw new Error(
      "Failed to add incident note"
    );

  }


  return response.json();

}


export async function resolveIncident(
  id,
  resolution,
  analyst = "SOC Analyst"
) {

  const response =
    await fetch(
      `${API_BASE_URL}/incidents/${id}/resolve`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            resolution,
            analyst
          })

      }
    );


  if (!response.ok) {

    throw new Error(
      "Failed to resolve incident"
    );

  }


  return response.json();

}