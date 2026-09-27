import { useEffect, useState } from "react";

function Response() {
  const [actions, setActions] = useState([]);
  const [playbooks, setPlaybooks] = useState({});

  const loadData = async () => {
    try {
      const actionsResponse = await fetch(
        "http://localhost:5000/api/response/actions"
      );

      const playbooksResponse = await fetch(
        "http://localhost:5000/api/response/playbooks"
      );

      const actionsData = await actionsResponse.json();
      const playbooksData = await playbooksResponse.json();

      setActions(actionsData);
      setPlaybooks(playbooksData);
    } catch (error) {
      console.error("Failed to load response data:", error);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page">
      <h1>SOAR Response</h1>

      <div className="response-summary">
        <div className="stat-card">
          <span>Playbooks</span>
          <strong>
            {Object.keys(playbooks).length}
          </strong>
        </div>

        <div className="stat-card">
          <span>Response Actions</span>
          <strong>{actions.length}</strong>
        </div>

        <div className="stat-card">
          <span>Simulated Actions</span>
          <strong>
            {
              actions.filter(
                action => action.status === "SIMULATED"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="response-panel">
        <h2>Response Activity</h2>

        {actions.length === 0 ? (
          <p>No response actions executed yet.</p>
        ) : (
          <div className="response-list">
            {actions.map(action => (
              <div
                className="response-item"
                key={action.id}
              >
                <div>
                  <strong>{action.action}</strong>

                  <p>
                    {action.message}
                  </p>

                  <small>
                    Source: {action.sourceIP}
                  </small>
                </div>

                <span className="response-status">
                  {action.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Response;