import { type CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.handwriting.tracing',
  appName: 'Handwriting Tracing',
  webDir: 'dist',
  ios: {
    scheme: 'App',
  },
};

export default config;
