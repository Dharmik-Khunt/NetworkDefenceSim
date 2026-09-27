import { useState } from "react";

function NetworkTopology() {

  const [selectedDevice, setSelectedDevice] = useState(null);

  const devices = [
    {
      id: "internet",
      icon: "🌐",
      name: "Internet",
      ip: "External",
      type: "external",
      status: "normal"
    },
    {
      id: "firewall",
      icon: "🔥",
      name: "Firewall",
      ip: "10.0.0.1",
      type: "firewall",
      status: "normal"
    },
    {
      id: "web",
      icon: "🖥️",
      name: "Web Server",
      ip: "10.0.0.10",
      type: "server",
      status: "warning"
    },
    {
      id: "database",
      icon: "🗄️",
      name: "Database",
      ip: "10.0.0.20",
      type: "database",
      status: "normal"
    }
  ];

  return (
    <section className="panel">

      <div className="panel-header">
        <h2>Network Topology</h2>
        <span>LIVE</span>
      </div>

      <div className="network">

        {devices.map((device, index) => (

          <div key={device.id}>

            <div
                className={`network-node ${device.status}`}
                onClick={() => setSelectedDevice(device)}
            >

              <div className="device-icon">
                {device.icon}
              </div>

              <strong>{device.name}</strong>

              <small>{device.ip}</small>

            </div>

            {index < devices.length - 1 && (
              <div className="connection">
                →
              </div>
            )}

          </div>

        ))}

      </div>
      {selectedDevice && (

  <div className="device-details">

    <h3>
      {selectedDevice.icon} {selectedDevice.name}
    </h3>

    <p>
      <strong>IP Address:</strong>{" "}
      {selectedDevice.ip}
    </p>

    <p>
      <strong>Type:</strong>{" "}
      {selectedDevice.type}
    </p>

    <p>
      <strong>Status:</strong>{" "}
      {selectedDevice.status.toUpperCase()}
    </p>

    <button
      onClick={() => setSelectedDevice(null)}
    >
      Close
    </button>

  </div>

)}

    </section>
  );
}

export default NetworkTopology;