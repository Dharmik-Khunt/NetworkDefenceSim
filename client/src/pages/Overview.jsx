import { useEffect, useState } from "react";

import {
  FiAlertTriangle,
  FiActivity,
  FiShield,
  FiServer
} from "react-icons/fi";

import {
  getTraffic,
  getAlerts
} from "../api/api";


function Overview() {

  const [alerts, setAlerts] = useState([]);
  const [traffic, setTraffic] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  async function loadDashboardData() {

    try {

      setError(null);

      const [
        alertsData,
        trafficData
      ] = await Promise.all([

        getAlerts(),

        getTraffic()

      ]);


      setAlerts(
        Array.isArray(alertsData)
          ? alertsData
          : []
      );


      setTraffic(
        Array.isArray(trafficData)
          ? trafficData
          : []
      );


    } catch (err) {

      console.error(err);

      setError(
        "Unable to connect to the security backend."
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadDashboardData();

    const interval = setInterval(
      loadDashboardData,
      5000
    );

    return () => clearInterval(interval);

  }, []);


  /*
   * Calculate alert statistics
   */

  const criticalAlerts =
    alerts.filter(
      alert =>
        String(alert.severity).toUpperCase() ===
        "CRITICAL"
    ).length;


  const highAlerts =
    alerts.filter(
      alert =>
        String(alert.severity).toUpperCase() ===
        "HIGH"
    ).length;


  const mediumAlerts =
    alerts.filter(
      alert =>
        String(alert.severity).toUpperCase() ===
        "MEDIUM"
    ).length;


  /*
   * Calculate overall risk
   */

  let riskScore = 0;

  if (criticalAlerts > 0) {
    riskScore += 50;
  }

  if (highAlerts > 0) {
    riskScore += 30;
  }

  if (mediumAlerts > 0) {
    riskScore += 10;
  }

  if (riskScore > 100) {
    riskScore = 100;
  }


  /*
   * Determine risk label
   */

  let riskLabel = "LOW RISK";

  if (riskScore >= 70) {
    riskLabel = "HIGH RISK";
  } else if (riskScore >= 40) {
    riskLabel = "MEDIUM RISK";
  }


  return (

    <div className="page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Security Overview
          </h1>

          <p>
            Monitor your simulated network
            and security activity.
          </p>

        </div>


        <div className="system-status">

          <span className="status-dot"></span>

          System Operational

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div
          style={{
            background: "#3f1d1d",
            border: "1px solid #7f1d1d",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "6px",
            color: "#fca5a5",
            fontSize: "12px"
          }}
        >

          ⚠ {error}

        </div>

      )}


      {/* STATISTICS */}

      <div className="stats-grid">


        <div className="stat-card critical">

          <div className="stat-icon">
            <FiAlertTriangle />
          </div>

          <div>

            <p>
              Critical Alerts
            </p>

            <h2>
              {loading ? "..." : criticalAlerts}
            </h2>

          </div>

        </div>


        <div className="stat-card high">

          <div className="stat-icon">
            <FiShield />
          </div>

          <div>

            <p>
              High Alerts
            </p>

            <h2>
              {loading ? "..." : highAlerts}
            </h2>

          </div>

        </div>


        <div className="stat-card events">

          <div className="stat-icon">
            <FiActivity />
          </div>

          <div>

            <p>
              Network Events
            </p>

            <h2>
              {loading ? "..." : traffic.length}
            </h2>

          </div>

        </div>


        <div className="stat-card systems">

          <div className="stat-icon">
            <FiServer />
          </div>

          <div>

            <p>
              Active Systems
            </p>

            <h2>
              8
            </h2>

          </div>

        </div>

      </div>


      {/* THREAT ACTIVITY */}

      <div className="dashboard-grid">


        <div className="dashboard-panel large-panel">

          <div className="panel-header">

            <div>

              <h2>
                Threat Activity
              </h2>

              <p>
                Live security activity
              </p>

            </div>


            <select>

              <option>
                Last 24 Hours
              </option>

              <option>
                Last 7 Days
              </option>

              <option>
                Last 30 Days
              </option>

            </select>

          </div>


          <div className="chart-placeholder">

            <div className="chart-line">

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </div>


            <p>

              {traffic.length}
              {" "}
              network events received

            </p>

          </div>

        </div>


        {/* RISK */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Risk Level
              </h2>

              <p>
                Current network risk
              </p>

            </div>

          </div>


          <div className="risk-score">

            <div className="risk-number">
              {riskScore}
            </div>

            <div className="risk-label">
              {riskLabel}
            </div>

            <p>

              Based on detected
              security alerts.

            </p>

          </div>

        </div>

      </div>


      {/* SOURCES + ALERTS */}

      <div className="dashboard-grid">


        {/* TOP SOURCES */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <h2>
              Recent Network Activity
            </h2>

          </div>


          <div className="source-list">

            {traffic
              .slice(0, 5)
              .map((event, index) => (

                <div
                  className="source-row"
                  key={index}
                >

                  <span>

                    {event.source ||
                     event.sourceIP ||
                     "Unknown Source"}

                  </span>


                  <strong>

                    {event.port ||
                     event.destinationPort ||
                     "-"}

                  </strong>

                </div>

              ))}


            {traffic.length === 0 && (

              <p
                style={{
                  color: "#64748b",
                  fontSize: "11px"
                }}
              >

                No network events available.

              </p>

            )}

          </div>

        </div>


        {/* ALERTS */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <h2>
              Recent Alerts
            </h2>

          </div>


          <div className="alert-list">

            {alerts
              .slice(0, 5)
              .map((alert, index) => (

                <div
                  className="alert-row"
                  key={index}
                >

                  <span>

                    {String(
                      alert.severity ||
                      "UNKNOWN"
                    ).toUpperCase()}

                  </span>


                  <p>

                    {alert.type ||
                     alert.rule ||
                     alert.message ||
                     "Security Alert"}

                  </p>

                </div>

              ))}


            {alerts.length === 0 && (

              <p
                style={{
                  color: "#64748b",
                  fontSize: "11px"
                }}
              >

                No alerts detected.

              </p>

            )}

          </div>

        </div>

      </div>


      {/* DEBUG INFORMATION */}

      <div
        style={{
          marginTop: "15px",
          color: "#475569",
          fontSize: "9px"
        }}
      >

        Dashboard refresh interval: 5 seconds

      </div>

    </div>

  );

}


export default Overview;