import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

function HomePage({navigation}) {
  return (
    <View style={styles.mainLayout}>
      <TouchableOpacity
        style={[styles.button, styles.goldButton]}
        onPress={() => navigation.navigate('WriteNFC')}>
        <Text style={styles.buttonText}>Write NFC Tag</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.goldButton]}
        onPress={() => navigation.navigate('ReadNFC')}>
        <Text style={styles.buttonText}>Read NFC Tag</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  goldButton: {
    backgroundColor: '#c59f59',
  },
  buttonText: {
    color: 'black',
  },
});

export default HomePage; 