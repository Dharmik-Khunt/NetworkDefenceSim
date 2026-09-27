import { useEffect, useMemo, useState } from "react";
import { Search, X, Eye } from "lucide-react";
import { getEvents } from "../api/api";

function EventExplorer() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const data = await getEvents();

      const normalizedEvents = Array.isArray(data)
        ? data
        : data.events || [];

      setEvents(normalizedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();

    const interval = setInterval(loadEvents, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        JSON.stringify(event).toLowerCase().includes(searchText);

      const eventSeverity = String(
        event.severity || "INFO"
      ).toUpperCase();

      const matchesSeverity =
        severity === "ALL" || eventSeverity === severity;

      return matchesSearch && matchesSeverity;
    });
  }, [events, search, severity]);

  const getSeverityClass = (value) => {
    const normalized = String(value || "INFO").toLowerCase();

    if (normalized === "critical") return "event-critical";
    if (normalized === "high") return "event-high";
    if (normalized === "medium") return "event-medium";
    if (normalized === "low") return "event-low";

    return "event-info";
  };

  return (
    <div className="event-explorer-page">
      <div className="event-header">
        <div>
          <h1>Event Explorer</h1>
          <p>
            Search and investigate raw security events collected
            from the network.
          </p>
        </div>

        <div className="event-count">
          {filteredEvents.length} Events
        </div>
      </div>

      <div className="event-toolbar">
        <div className="event-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search IP, protocol, rule, action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="ALL">All Severity</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
          <option value="INFO">Info</option>
        </select>
      </div>

      <div className="event-table-wrapper">
        <table className="event-table">
          <thead>
            <tr>
              <th>TIME</th>
              <th>SEVERITY</th>
              <th>SOURCE</th>
              <th>DESTINATION</th>
              <th>PROTOCOL</th>
              <th>PORT</th>
              <th>ACTION</th>
              <th>RULE</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="event-empty">
                  Loading events...
                </td>
              </tr>
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="9" className="event-empty">
                  No events found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((event, index) => (
                <tr key={event.id || index}>
                  <td>
                    {event.timestamp
                      ? new Date(event.timestamp).toLocaleString()
                      : "Unknown"}
                  </td>

                  <td>
                    <span
                      className={`event-severity ${getSeverityClass(
                        event.severity
                      )}`}
                    >
                      {event.severity || "INFO"}
                    </span>
                  </td>

                  <td>
                    {event.sourceIp || "Unknown"}
                  </td>

                  <td>
                    {event.destinationIp || "Unknown"}
                  </td>

                  <td>
                    {event.protocol || "-"}
                  </td>

                  <td>
                    {event.port || "-"}
                  </td>

                  <td>
                    <span className="event-action">
                      {event.action || "-"}
                    </span>
                  </td>

                  <td>
                    {event.rule || "Network Event"}
                  </td>

                  <td>
                    <button
                      className="event-view-button"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedEvent && (
        <div className="event-detail-overlay">
          <div className="event-detail-panel">
            <div className="event-detail-header">
              <div>
                <h2>Event Details</h2>
                <p>
                  {selectedEvent.message ||
                    "Security event investigation"}
                </p>
              </div>

              <button
                className="event-close-button"
                onClick={() => setSelectedEvent(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="event-detail-grid">
              <div>
                <span>Event ID</span>
                <strong>
                  {selectedEvent.id || "N/A"}
                </strong>
              </div>

              <div>
                <span>Severity</span>
                <strong>
                  {selectedEvent.severity || "INFO"}
                </strong>
              </div>

              <div>
                <span>Source IP</span>
                <strong>
                  {selectedEvent.sourceIp || "Unknown"}
                </strong>
              </div>

              <div>
                <span>Destination IP</span>
                <strong>
                  {selectedEvent.destinationIp || "Unknown"}
                </strong>
              </div>

              <div>
                <span>Protocol</span>
                <strong>
                  {selectedEvent.protocol || "Unknown"}
                </strong>
              </div>

              <div>
                <span>Port</span>
                <strong>
                  {selectedEvent.port || "-"}
                </strong>
              </div>

              <div>
                <span>Action</span>
                <strong>
                  {selectedEvent.action || "-"}
                </strong>
              </div>

              <div>
                <span>Detection Rule</span>
                <strong>
                  {selectedEvent.rule || "None"}
                </strong>
              </div>
            </div>

            <div className="raw-event-section">
              <h3>Raw Event JSON</h3>

              <pre>
                {JSON.stringify(
                  selectedEvent.raw || selectedEvent,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventExplorer;