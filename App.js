import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WriteNFCPage from './pages/WriteNFCPage';
import ReadNFCPage from './pages/ReadNFCPage';
import HomePage from './pages/HomePage';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{title: 'Home'}}
        />
        <Stack.Screen
          name="WriteNFC"
          component={WriteNFCPage}
          options={{title: 'Write NFC'}}
        />
        <Stack.Screen
          name="ReadNFC"
          component={ReadNFCPage}
          options={{title: 'Read NFC'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
