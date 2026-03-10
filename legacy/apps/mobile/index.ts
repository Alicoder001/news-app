import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

import App from './App';

// For web, ensure root element exists
if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root');
  if (!rootTag) {
    const root = document.createElement('div');
    root.id = 'root';
    root.style.height = '100vh';
    root.style.width = '100vw';
    document.body.appendChild(root);
  }
  // Ensure body has proper styles
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.height = '100vh';
  document.body.style.width = '100vw';
  document.documentElement.style.height = '100vh';
  document.documentElement.style.width = '100vw';
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
