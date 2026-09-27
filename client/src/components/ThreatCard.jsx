import { useEffect, useState } from "react";
import { getStatus } from "../services/api";

function ThreatCard() {

  const [threatLevel, setThreatLevel] = useState("Loading...");
  const [threatScore, setThreatScore] = useState(0);

  useEffect(() => {

    getStatus()
      .then((response) => {

        setThreatLevel(response.data.threatLevel);
        setThreatScore(response.data.threatScore);

      })
      .catch((error) => {

        console.error("Failed to load threat status:", error);

      });

  }, []);

  return (
    <section className="threat-card">

      <div>

        <p>Current Threat Level</p>

        <h2>{threatLevel}</h2>

      </div>

      <div className="threat-score">

        {threatScore}

      </div>

    </section>
  );
}

export default ThreatCard;