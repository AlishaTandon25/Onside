import { CalculationType, UnitOfMeasurement } from "@prisma/client";

export function calculateProgressScore(params: {
  actualAchievement: number;
  targetValue: number;
  calculationType: CalculationType;
  unitOfMeasurement: UnitOfMeasurement;
  startDate?: Date | null;
  endDate?: Date | null;
  status: string;
}): number {
  const { actualAchievement, targetValue, calculationType, endDate, status } = params;

  let progress = 0;

  switch (calculationType) {
    case "MIN":
      if (targetValue === 0) {
        progress = actualAchievement > 0 ? 100 : 0;
      } else {
        progress = (actualAchievement / targetValue) * 100;
      }
      break;

    case "MAX":
      if (actualAchievement === 0) {
        progress = 100;
      } else {
        progress = (targetValue / actualAchievement) * 100;
      }
      break;

    case "TIMELINE":
      if (status === "COMPLETED") {
        progress = 100;
      } else if (endDate && new Date() > new Date(endDate)) {
        progress = 0;
      } else {
        // Manually entered progress based on status or elapsed time
        progress = actualAchievement;
      }
      break;

    case "ZERO":
      progress = actualAchievement === 0 ? 100 : 0;
      break;

    default:
      progress = 0;
  }

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, Number(progress.toFixed(2))));
}
