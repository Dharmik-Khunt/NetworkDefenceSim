import { useEffect, useState } from "react";

import {
  FiSearch,
  FiRefreshCw,
  FiAlertTriangle,
  FiFilter
} from "react-icons/fi";

import {
  getAlerts
} from "../api/api";

import AlertInvestigation
  from "../components/AlertInvestigation";


function Alerts() {

  const [alerts, setAlerts] = useState([]);

  const [selectedAlert, setSelectedAlert] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [loading, setLoading] =
    useState(true);


  async function loadAlerts() {

    try {

      setLoading(true);

      const data = await getAlerts();

      const normalized =
        Array.isArray(data)
          ? data.map((alert, index) => ({

              ...alert,

              id:
                alert.id ||
                alert._id ||
                `alert-${index}`,

              status:
                alert.status ||
                "OPEN"

            }))
          : [];

      setAlerts(normalized);

    } catch (error) {

      console.error(
        "Failed to load alerts:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadAlerts();

    const interval =
      setInterval(loadAlerts, 5000);

    return () =>
      clearInterval(interval);

  }, []);


  /*
   * FILTER ALERTS
   */

  const filteredAlerts =
    alerts.filter((alert) => {

      const severity =
        String(
          alert.severity || "UNKNOWN"
        ).toUpperCase();


      const status =
        String(
          alert.status || "OPEN"
        ).toUpperCase();


      const title =
        String(
          alert.type ||
          alert.rule ||
          alert.message ||
          ""
        ).toLowerCase();


      const matchesSearch =
        title.includes(
          search.toLowerCase()
        );


      const matchesSeverity =
        severityFilter === "ALL" ||
        severity === severityFilter;


      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;


      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );

    });


  /*
   * STATUS CHANGE
   */

  function updateAlertStatus(
    status
  ) {

    if (!selectedAlert) {
      return;
    }


    const updatedAlert = {

      ...selectedAlert,

      status

    };


    setAlerts(
      currentAlerts =>
        currentAlerts.map(alert =>
          alert.id === selectedAlert.id
            ? updatedAlert
            : alert
        )
    );


    setSelectedAlert(
      updatedAlert
    );

  }


  /*
   * STATISTICS
   */

  const criticalCount =
    alerts.filter(
      alert =>
        String(
          alert.severity || ""
        ).toUpperCase() ===
        "CRITICAL"
    ).length;


  const highCount =
    alerts.filter(
      alert =>
        String(
          alert.severity || ""
        ).toUpperCase() ===
        "HIGH"
    ).length;


  const openCount =
    alerts.filter(
      alert =>
        String(
          alert.status || "OPEN"
        ).toUpperCase() ===
        "OPEN"
    ).length;


  return (

    <div className="page">


      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Security Alerts
          </h1>

          <p>
            Monitor, investigate and manage
            security detections.
          </p>

        </div>


        <button
          className="refresh-button"
          onClick={loadAlerts}
        >

          <FiRefreshCw />

          Refresh

        </button>

      </div>


      {/* STATISTICS */}

      <div className="alert-stat-grid">


        <div className="alert-stat">

          <span>
            TOTAL ALERTS
          </span>

          <strong>
            {alerts.length}
          </strong>

        </div>


        <div className="alert-stat critical-stat">

          <span>
            CRITICAL
          </span>

          <strong>
            {criticalCount}
          </strong>

        </div>


        <div className="alert-stat high-stat">

          <span>
            HIGH
          </span>

          <strong>
            {highCount}
          </strong>

        </div>


        <div className="alert-stat">

          <span>
            OPEN
          </span>

          <strong>
            {openCount}
          </strong>

        </div>

      </div>


      {/* FILTER BAR */}

      <div className="alert-toolbar">


        <div className="alert-search">

          <FiSearch />

          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={
              e => setSearch(e.target.value)
            }
          />

        </div>


        <div className="filter-control">

          <FiFilter />

          <select
            value={severityFilter}
            onChange={
              e =>
                setSeverityFilter(
                  e.target.value
                )
            }
          >

            <option value="ALL">
              All Severities
            </option>

            <option value="CRITICAL">
              Critical
            </option>

            <option value="HIGH">
              High
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="LOW">
              Low
            </option>

          </select>

        </div>


        <select
          className="filter-select"
          value={statusFilter}
          onChange={
            e =>
              setStatusFilter(
                e.target.value
              )
          }
        >

          <option value="ALL">
            All Status
          </option>

          <option value="OPEN">
            Open
          </option>

          <option value="ACKNOWLEDGED">
            Acknowledged
          </option>

          <option value="INVESTIGATING">
            Investigating
          </option>

          <option value="RESOLVED">
            Resolved
          </option>

        </select>


      </div>


      {/* ALERT TABLE */}

      <div className="alerts-panel">


        <div className="alerts-table-header">

          <span>
            SEVERITY
          </span>

          <span>
            DETECTION
          </span>

          <span>
            SOURCE
          </span>

          <span>
            DESTINATION
          </span>

          <span>
            STATUS
          </span>

          <span>
            ACTION
          </span>

        </div>


        {loading ? (

          <div className="empty-alerts">
            Loading security alerts...
          </div>

        ) : filteredAlerts.length === 0 ? (

          <div className="empty-alerts">

            <FiAlertTriangle />

            <p>
              No alerts found.
            </p>

          </div>

        ) : (

          filteredAlerts.map(
            (alert) => {

              const severity =
                String(
                  alert.severity ||
                  "UNKNOWN"
                ).toUpperCase();


              const status =
                String(
                  alert.status ||
                  "OPEN"
                ).toUpperCase();


              return (

                <div
                  className="alert-table-row"
                  key={alert.id}
                >


                  <div>

                    <span
                      className={
                        `severity-badge severity-${severity.toLowerCase()}`
                      }
                    >

                      {severity}

                    </span>

                  </div>


                  <div className="detection-name">

                    <strong>

                      {alert.type ||
                        alert.rule ||
                        alert.name ||
                        alert.message ||
                        "Security Detection"}

                    </strong>

                    <small>

                      {alert.rule ||
                        "Detection Engine"}

                    </small>

                  </div>


                  <div>

                    {alert.sourceIP ||
                      alert.source ||
                      "-"}

                  </div>


                  <div>

                    {alert.destinationIP ||
                      alert.destination ||
                      "-"}

                  </div>


                  <div>

                    <span
                      className={
                        `status-badge status-${status.toLowerCase()}`
                      }
                    >

                      {status}

                    </span>

                  </div>


                  <div>

                    <button
                      className="investigate-button"
                      onClick={() =>
                        setSelectedAlert(
                          alert
                        )
                      }
                    >

                      Investigate

                    </button>

                  </div>


                </div>

              );

            }
          )

        )}

      </div>


      {/* INVESTIGATION MODAL */}

      {selectedAlert && (

        <AlertInvestigation

          alert={selectedAlert}

          onClose={() =>
            setSelectedAlert(null)
          }

          onStatusChange={
            updateAlertStatus
          }

        />

      )}

    </div>

  );

}


export default Alerts;