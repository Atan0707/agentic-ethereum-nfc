import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { nfcManager } from '../utils/nfcManager';

const WriteNFCPage = () => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  const writeText = async () => {
    if (!text) {
      Alert.alert('Error', 'Please enter text to write');
      return;
    }
    const result = await nfcManager.writeNFCText(text);
    if (result) {
      Alert.alert('Success', 'Text written to NFC tag');
    } else {
      Alert.alert('Error', 'Failed to write to NFC tag');
    }
  };

  const writeUrl = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter URL to write');
      return;
    }
    const result = await nfcManager.writeNFCUrl(url);
    if (result) {
      Alert.alert('Success', 'URL written to NFC tag');
    } else {
      Alert.alert('Error', 'Failed to write to NFC tag');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter text to write"
        value={text}
        onChangeText={setText}
      />
      <Button title="Write Text to NFC" onPress={writeText} />

      <TextInput
        style={styles.input}
        placeholder="Enter URL to write"
        value={url}
        onChangeText={setUrl}
      />
      <Button title="Write URL to NFC" onPress={writeUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default WriteNFCPage; 