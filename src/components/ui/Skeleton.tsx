import { FC } from 'react';

interface SkeletonProps {
  _width?: number | string;
  _height?: number;
  _borderRadius?: number;
  _style?: any;
}

export const Skeleton: FC<SkeletonProps> = ({
  _width = '100%',
  _height = 16,
  _borderRadius = 4,
  _style,
}) => {
  return null;
};
