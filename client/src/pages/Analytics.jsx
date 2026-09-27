import { useEffect, useState } from "react";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/analytics"
      );

      const data = await response.json();

      setAnalytics(data);
    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );
    }
  };

  useEffect(() => {
    loadAnalytics();

    const interval = setInterval(
      loadAnalytics,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  if (!analytics) {
    return (
      <div className="page">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="page analytics-page">

      <div className="page-header">
        <div>
          <h1>SOC Analytics</h1>
          <p>
            Security monitoring and operational metrics
          </p>
        </div>
      </div>

      {/* Summary */}

      <div className="analytics-summary">

        <div className="analytics-card">
          <span>Total Events</span>
          <strong>
            {analytics.summary.totalEvents}
          </strong>
        </div>

        <div className="analytics-card">
          <span>Total Alerts</span>
          <strong>
            {analytics.summary.totalAlerts}
          </strong>
        </div>

        <div className="analytics-card">
          <span>Total Incidents</span>
          <strong>
            {analytics.summary.totalIncidents}
          </strong>
        </div>

        <div className="analytics-card">
          <span>Responses</span>
          <strong>
            {analytics.summary.totalResponses}
          </strong>
        </div>

      </div>

      {/* Severity */}

      <div className="analytics-grid">

        <div className="analytics-panel">

          <h2>Alert Severity</h2>

          {Object.entries(
            analytics.severity
          ).map(([level, count]) => (
            <div
              className="metric-row"
              key={level}
            >
              <span>{level}</span>

              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${
                      analytics.summary.totalAlerts
                        ? (count /
                            analytics.summary.totalAlerts) *
                          100
                        : 0
                    }%`
                  }}
                />
              </div>

              <strong>{count}</strong>
            </div>
          ))}

        </div>

        {/* Incident Status */}

        <div className="analytics-panel">

          <h2>Incident Status</h2>

          {Object.entries(
            analytics.incidentStatus
          ).map(([status, count]) => (
            <div
              className="metric-row"
              key={status}
            >
              <span>{status}</span>

              <div className="metric-number">
                {count}
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Detection Rules */}

      <div className="analytics-panel">

        <h2>Top Detection Rules</h2>

        {analytics.topDetectionRules.length === 0 ? (
          <p>No detection data available.</p>
        ) : (
          analytics.topDetectionRules.map(
            item => (
              <div
                className="analytics-list-row"
                key={item.rule}
              >
                <span>{item.rule}</span>
                <strong>{item.count}</strong>
              </div>
            )
          )
        )}

      </div>

      {/* MITRE */}

      <div className="analytics-panel">

        <h2>MITRE ATT&CK Techniques</h2>

        {analytics.topMitreTechniques.length === 0 ? (
          <p>No MITRE data available.</p>
        ) : (
          analytics.topMitreTechniques.map(
            item => (
              <div
                className="analytics-list-row"
                key={item.technique}
              >
                <span>
                  {item.technique}
                </span>

                <strong>
                  {item.count}
                </strong>
              </div>
            )
          )
        )}

      </div>

      {/* Top Source IPs */}

      <div className="analytics-panel">

        <h2>Top Source IPs</h2>

        {analytics.topSourceIPs.length === 0 ? (
          <p>No source IP data available.</p>
        ) : (
          analytics.topSourceIPs.map(
            item => (
              <div
                className="analytics-list-row"
                key={item.ip}
              >
                <span className="ip-address">
                  {item.ip}
                </span>

                <strong>
                  {item.count} alerts
                </strong>
              </div>
            )
          )
        )}

      </div>

      {/* Response */}

      <div className="analytics-panel">

        <h2>SOAR Response Status</h2>

        {Object.entries(
          analytics.responseStatus
        ).map(([status, count]) => (
          <div
            className="analytics-list-row"
            key={status}
          >
            <span>{status}</span>
            <strong>{count}</strong>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Analytics;