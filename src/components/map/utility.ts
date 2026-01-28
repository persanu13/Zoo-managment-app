export function calculateBoundingBox(perimeterPoints: number[]) {
  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;

  // Parcurge punctele (x1,y1,x2,y2,x3,y3...)
  for (let i = 0; i < perimeterPoints.length; i += 2) {
    const x = perimeterPoints[i];
    const y = perimeterPoints[i + 1];

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function polygonCentroid(points: number[]) {
  let area = 0;
  let cx = 0;
  let cy = 0;

  const n = points.length / 2;

  for (let i = 0; i < n; i++) {
    const x1 = points[i * 2];
    const y1 = points[i * 2 + 1];

    const x2 = points[((i + 1) % n) * 2];
    const y2 = points[((i + 1) % n) * 2 + 1];

    const cross = x1 * y2 - x2 * y1;
    area += cross;
    cx += (x1 + x2) * cross;
    cy += (y1 + y2) * cross;
  }

  area *= 0.5;

  return {
    x: cx / (6 * area),
    y: cy / (6 * area),
  };
}

export const HABITAT_COLORS: Record<string, string> = {
  forest: "#22C55E",
  desert: "#FACC15",
  water: "#3B82F6",
  mountain: "#64748B",
  urban: "#A855F7",
  grassland: "#4ADE80",
  jungle: "#16A34A",
  savanna: "#EAB308",
  swamp: "#065F46",
  tundra: "#CBD5E1",
  ice: "#5DD3B6",
};

export function getHabitatColor(type: string): string {
  return HABITAT_COLORS[type] ?? "#FBBF24"; // fallback sigur
}
