import React from 'react';
import MainComponent from './components/MainComponent';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

  return (
    <SafeAreaProvider>
      <MainComponent/>
    </SafeAreaProvider>
  );
}
