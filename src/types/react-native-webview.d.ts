declare module 'react-native-webview' {
  import { NativeSyntheticEvent } from 'react-native';

  export interface WebViewMessageEvent {
    nativeEvent: {
      data: string;
    };
  }

  export interface WebViewProps {
    source: { html?: string; uri?: string };
    onMessage?: (event: NativeSyntheticEvent<WebViewMessageEvent>) => void;
    onLoadEnd?: () => void;
    ref?: React.Ref<any>;
    javaScriptEnabled?: boolean;
    domStorageEnabled?: boolean;
    startInLoadingState?: boolean;
    scalesPageToFit?: boolean;
    mixedContentMode?: 'compatibility' | 'error' | 'none';
    style?: any;
  }

  export const WebView: React.ComponentType<WebViewProps>;
  export default WebView;
}
