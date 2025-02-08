import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WriteNFCPage from './pages/WriteNFCPage';
import ReadNFCPage from './pages/ReadNFCPage';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <View>
          <Image
            source={require('./public/blockcash.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <Stack.Navigator
          initialRouteName="WriteNFC"
          screenOptions={{
            headerShown: true,
            headerTitleStyle: {
              color: 'black',
            },
          }}>
          <Stack.Screen
            name="Write NFC"
            component={WriteNFCPage}
            options={{
              title: 'Write to NFC Tag',
            }}
          />
          <Stack.Screen
            name="Read NFC"
            component={ReadNFCPage}
            options={{
              title: 'Read NFC Tag',
            }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default App;
