import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Modal,
  Text,
  ActivityIndicator,
} from 'react-native';
import { nfcManager } from '../utils/nfcManager';

const WriteNFCPage = () => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const writeText = async () => {
    if (!text) {
      Alert.alert('Error', 'Please enter text to write');
      return;
    }
    setIsScanning(true);
    const result = await nfcManager.writeNFCText(text);
    setIsScanning(false);
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
    setIsScanning(true);
    const result = await nfcManager.writeNFCUrl(url);
    setIsScanning(false);
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
      <Button style={styles.button} title="Write Text to NFC" onPress={writeText} />

      <TextInput
        style={styles.input}
        placeholder="Enter URL to write"
        value={url}
        onChangeText={setUrl}
      />
      <Button style={styles.button} title="Write URL to NFC" onPress={writeUrl} />

      <Modal visible={isScanning} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.scanTitle}>Scan NFC</Text>
            <ActivityIndicator size="large" color="#5A4FCF" />
            <Text style={styles.modalText}>
              Please hold your NFC tag against the device...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    minWidth: '80%',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5A4FCF',
  },
});

export default WriteNFCPage;
