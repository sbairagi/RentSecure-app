declare module '@expo/vector-icons' {
  import { SvgProps } from 'react-native-svg';
  import { ComponentType } from 'react';

  export const MaterialCommunityIcons: ComponentType<{
    name: string;
    size?: number;
    color?: string | number;
  }>;

  export const MaterialIcons: ComponentType<{
    name: string;
    size?: number;
    color?: string | number;
  }>;

  export const Ionicons: ComponentType<{
    name: string;
    size?: number;
    color?: string | number;
  }>;

  export const FontAwesome: ComponentType<{
    name: string;
    size?: number;
    color?: string | number;
  }>;

  export const Fontisto: ComponentType<{
    name: string;
    size?: number;
    color?: string | number;
  }>;

  export const Feather: ComponentType<{
    name: string;
    size?: number;
    color?: string | number;
  }>;
}
