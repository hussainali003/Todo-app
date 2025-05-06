import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as Font from 'expo-font';
import * as SystemUI from 'expo-system-ui';
import * as SplashScreen from 'expo-splash-screen';

import TodoList from './components/TodoList';

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    'Oswald-Bold': require('./assets/fonts/Oswald-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SystemUI.setBackgroundColorAsync('#000000'); // Moved inside
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <View style={styles.container}>
          <TodoList />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
