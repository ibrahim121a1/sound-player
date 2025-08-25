/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { playbackService } from './service';
import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);
// Register background service for remote controls / audio focus
TrackPlayer.registerPlaybackService(() => playbackService);
