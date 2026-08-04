export const elevation = {
  level0: 0,
  level1: 1,
  level2: 2,
  level3: 3,
  level4: 5,
  level5: 8,
  level6: 12,
} as const;

export type ElevationLevel = keyof typeof elevation;
