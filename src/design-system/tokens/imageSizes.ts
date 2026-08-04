export const imageSizes = {
  thumbnail: { width: 80, height: 80 },
  small: { width: 120, height: 120 },
  medium: { width: 200, height: 200 },
  large: { width: 300, height: 300 },
  full: { width: '100%', height: 200 },
  cover: { width: '100%', height: 250 },
} as const;

export type ImageSizeKey = keyof typeof imageSizes;
export type ImageSizeValue = (typeof imageSizes)[ImageSizeKey];
