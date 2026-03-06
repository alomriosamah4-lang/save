import {AppRegistry} from 'react-native';
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {name as appName} from '../app.json';

AppRegistry.registerComponent(appName || 'SecureVaultApp', () => App);

const rootTag = document.getElementById('root') || document.createElement('div');
if (!rootTag.parentElement) document.body.appendChild(rootTag);

AppRegistry.runApplication(appName || 'SecureVaultApp', {
  rootTag,
});
