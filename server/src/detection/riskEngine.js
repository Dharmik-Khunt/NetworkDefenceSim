function calculateRisk(detections) {

  if (
    !detections ||
    detections.length === 0
  ) {

    return {
      score: 0,
      level: "LOW"
    };

  }


  // =========================================
  // TOTAL DETECTION SCORE
  // =========================================

  const totalScore =
    detections.reduce(
      (total, detection) =>
        total + (detection.score || 0),
      0
    );


  // =========================================
  // CHECK FOR CRITICAL DETECTION
  // =========================================

  const hasCriticalDetection =
    detections.some(
      detection =>
        detection.severity === "CRITICAL"
    );


  let level = "LOW";


  if (
    hasCriticalDetection ||
    totalScore >= 75
  ) {

    level = "CRITICAL";

  }
  else if (
    totalScore >= 50
  ) {

    level = "HIGH";

  }
  else if (
    totalScore >= 25
  ) {

    level = "MEDIUM";

  }


  return {

    score:
      Math.min(
        totalScore,
        100
      ),

    level

  };

}


module.exports = {
  calculateRisk
};