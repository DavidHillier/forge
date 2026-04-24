export function determineReadinessRecommendation(
  sleepQuality: string,
  soreness: string,
  energyLevel: string,
  timeAvailable: string,
) {
  if (sleepQuality === "poor" && energyLevel === "low") {
    return "Choose a recovery session today. Complete the minimum and protect tomorrow.";
  }
  if (soreness === "high") {
    return "Use the lighter version or recovery session. Keep form sharp.";
  }
  if (timeAvailable === "10") {
    return "Complete the 8-minute minimum. Build consistency.";
  }
  return "Proceed as planned. You're ready for today's workout.";
}
