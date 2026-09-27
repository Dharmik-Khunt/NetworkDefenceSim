import { useEffect, useState } from "react";
import "./Incidents.css";

const API_URL = "http://localhost:5000";

function Incidents() {

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [error, setError] = useState("");

  const loadIncidents = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/incidents`
      );

      if (!response.ok) {
  const errorText = await response.text();

  throw new Error(
    `Backend returned ${response.status}: ${errorText}`
  );
}

      const data = await response.json();

      setIncidents(data);

    } catch (err) {

      console.error("Incident loading error:", err);

      setError(
  err.message ||
  "Unable to load incidents from the SOC backend."
);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadIncidents();

    const interval = setInterval(
      loadIncidents,
      5000
    );

    return () => clearInterval(interval);

  }, []);


  const getSeverityClass = (severity) => {

    if (!severity) {
      return "severity-low";
    }

    return `severity-${severity
      .toLowerCase()}`;

  };


  const getStatusClass = (status) => {

    if (!status) {
      return "status-open";
    }

    return `status-${status
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

  };


  const total = incidents.length;

  const open = incidents.filter(
    incident =>
      String(incident.status).toLowerCase() ===
      "open"
  ).length;

  const investigating = incidents.filter(
    incident =>
      String(incident.status).toLowerCase() ===
      "investigating"
  ).length;

  const resolved = incidents.filter(
    incident =>
      String(incident.status).toLowerCase() ===
      "resolved"
  ).length;


  if (loading) {

    return (
      <div className="incidents-page">

        <div className="page-loading">
          Loading security incidents...
        </div>

      </div>
    );

  }


  return (

    <div className="incidents-page">

      {/* PAGE HEADER */}

      <div className="incidents-header">

        <div>
          <h1>Incident Management</h1>

          <p>
            Investigate, track and resolve security incidents.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadIncidents}
        >
          Refresh
        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div className="incident-error">
          {error}
        </div>

      )}


      {/* STATISTICS */}

      <div className="incident-statistics">

        <div className="incident-stat-card">

          <span>Total Incidents</span>

          <strong>{total}</strong>

        </div>


        <div className="incident-stat-card">

          <span>Open</span>

          <strong>{open}</strong>

        </div>


        <div className="incident-stat-card">

          <span>Investigating</span>

          <strong>{investigating}</strong>

        </div>


        <div className="incident-stat-card">

          <span>Resolved</span>

          <strong>{resolved}</strong>

        </div>

      </div>


      {/* INCIDENT TABLE */}

      <div className="incidents-panel">

        <div className="panel-header">

          <div>

            <h2>Security Incidents</h2>

            <span>
              {total} incident{total !== 1 ? "s" : ""}
            </span>

          </div>

        </div>


        {incidents.length === 0 ? (

          <div className="empty-incidents">

            <h3>No incidents found</h3>

            <p>
              Create an incident from a detected security alert.
            </p>

          </div>

        ) : (

          <div className="incident-table-wrapper">

            <table className="incident-table">

              <thead>

                <tr>

                  <th>ID</th>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>

                </tr>

              </thead>


              <tbody>

                {incidents.map((incident) => (

                  <tr key={incident.id}>

                    <td className="incident-id">
                      {incident.id}
                    </td>


                    <td>

                      <div className="incident-title">

                        <strong>
                          {incident.title ||
                            incident.name ||
                            "Security Incident"}
                        </strong>

                        <span>
                          {incident.description ||
                            "Security event requiring investigation"}
                        </span>

                      </div>

                    </td>


                    <td>

                      <span
                        className={`severity-badge ${getSeverityClass(
                          incident.severity
                        )}`}
                      >
                        {incident.severity ||
                          "LOW"}
                      </span>

                    </td>


                    <td>

                      <span
                        className={`status-badge ${getStatusClass(
                          incident.status
                        )}`}
                      >
                        {incident.status ||
                          "OPEN"}
                      </span>

                    </td>


                    <td>

                      {incident.createdAt
                        ? new Date(
                            incident.createdAt
                          ).toLocaleString()
                        : "—"}

                    </td>


                    <td>

                      <button
                        className="view-incident-button"
                        onClick={() =>
                          setSelectedIncident(
                            incident
                          )
                        }
                      >
                        Investigate
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* INCIDENT DETAILS */}

      {selectedIncident && (

        <div className="incident-overlay">

          <div className="incident-details">

            <div className="details-header">

              <div>

                <span className="details-id">
                  {selectedIncident.id}
                </span>

                <h2>
                  {selectedIncident.title ||
                    selectedIncident.name ||
                    "Security Incident"}
                </h2>

              </div>


              <button
                className="close-details"
                onClick={() =>
                  setSelectedIncident(null)
                }
              >
                ×
              </button>

            </div>


            <div className="details-meta">

              <div>

                <span>Severity</span>

                <strong
                  className={`severity-badge ${getSeverityClass(
                    selectedIncident.severity
                  )}`}
                >
                  {selectedIncident.severity ||
                    "LOW"}
                </strong>

              </div>


              <div>

                <span>Status</span>

                <strong
                  className={`status-badge ${getStatusClass(
                    selectedIncident.status
                  )}`}
                >
                  {selectedIncident.status ||
                    "OPEN"}
                </strong>

              </div>


              <div>

                <span>Created</span>

                <strong>

                  {selectedIncident.createdAt
                    ? new Date(
                        selectedIncident.createdAt
                      ).toLocaleString()
                    : "—"}

                </strong>

              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="details-section">

              <h3>Description</h3>

              <p>
                {selectedIncident.description ||
                  "No incident description available."}
              </p>

            </div>


            {/* ALERT */}

            <div className="details-section">

              <h3>Related Alerts</h3>

              {selectedIncident.relatedAlerts &&
              selectedIncident.relatedAlerts.length > 0 ? (

                <div className="related-alerts">

                  {selectedIncident.relatedAlerts.map(
                    (alert, index) => (

                      <div
                        className="related-alert"
                        key={index}
                      >
                        {typeof alert === "object"
                          ? alert.id
                          : alert}
                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="muted-text">
                  No related alerts linked.
                </p>

              )}

            </div>


            {/* NOTES */}

            <div className="details-section">

              <h3>Investigation Notes</h3>

              {selectedIncident.notes &&
              selectedIncident.notes.length > 0 ? (

                <div className="notes-list">

                  {selectedIncident.notes.map(
                    (note, index) => (

                      <div
                        className="note-item"
                        key={index}
                      >

                        <strong>
                          {note.analyst ||
                            "SOC Analyst"}
                        </strong>

                        <p>
                          {note.note ||
                            note.text ||
                            ""}
                        </p>

                        {note.timestamp && (

                          <span>
                            {new Date(
                              note.timestamp
                            ).toLocaleString()}
                          </span>

                        )}

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="muted-text">
                  No investigation notes yet.
                </p>

              )}

            </div>


            {/* CLOSE */}

            <div className="details-actions">

              <button
                className="secondary-action"
                onClick={() =>
                  setSelectedIncident(null)
                }
              >
                Close Investigation
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


export default Incidents;