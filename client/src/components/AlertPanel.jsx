function AlertPanel() {

  const alerts = [
    {
      severity: "CRITICAL",
      title: "Possible Data Exfiltration",
      source: "10.0.0.15",
      destination: "External Network"
    },
    {
      severity: "HIGH",
      title: "Brute Force Detected",
      source: "203.0.113.50",
      destination: "SSH Server"
    },
    {
      severity: "MEDIUM",
      title: "Port Scan Detected",
      source: "198.51.100.23",
      destination: "Internal Network"
    }
  ];

  return (
    <section className="panel">

      <div className="panel-header">

        <h2>Active Security Alerts</h2>

        <span>
          {alerts.length} ALERTS
        </span>

      </div>

      {alerts.map((alert, index) => (

        <div
          className={`alert ${alert.severity.toLowerCase()}`}
          key={index}
        >

          <strong>
            {alert.severity}
          </strong>

          <span>
            {alert.title}
          </span>

          <small>
            {alert.source} → {alert.destination}
          </small>

        </div>

      ))}

    </section>
  );
}

export default AlertPanel;