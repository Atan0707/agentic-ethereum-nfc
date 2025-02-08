import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

NfcManager.start();

function WriteNFCPage({navigation}) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  async function writeNdefText() {
    if (!text) {
      Alert.alert('Error', 'Please enter text to write');
      return;
    }

    let result = false;
    try {
      setLoading(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
        Alert.alert('Success', 'Text written to NFC tag');
      }
    } catch (ex) {
      console.warn(ex);
      Alert.alert('Error', 'Failed to write to NFC tag');
    } finally {
      NfcManager.cancelTechnologyRequest();
      setLoading(false);
    }
    return result;
  }

  async function writeNdefUrl() {
    if (!url) {
      Alert.alert('Error', 'Please enter URL to write');
      return;
    }

    let result = false;
    try {
      setLoading(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
        Alert.alert('Success', 'URL written to NFC tag');
      }
    } catch (ex) {
      console.warn(ex);
      Alert.alert('Error', 'Failed to write to NFC tag');
    } finally {
      NfcManager.cancelTechnologyRequest();
      setLoading(false);
    }
    return result;
  }

  return (
    <View style={styles.mainLayout}>
      <TextInput
        style={styles.input}
        placeholder="Enter text to write"
        value={text}
        onChangeText={setText}
        placeholderTextColor={'black'}
      />
      <TouchableOpacity
        onPress={writeNdefText}
        style={[styles.button, {backgroundColor: '#c59f59'}]}>
        <Text style={{color: 'black'}}>Write Text to NFC</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter URL to write"
        value={url}
        onChangeText={setUrl}
        placeholderTextColor={'black'}
      />
      <TouchableOpacity
        onPress={writeNdefUrl}
        style={[styles.button, {backgroundColor: '#c59f59'}]}>
        <Text style={{color: 'black'}}>Write URL to NFC</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={{color: 'white'}}>Back to Home</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size={'large'} color={'#0ca973'} />}
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
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    color: 'black',
  },
  homeButton: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: 'black',
  },
});

export default WriteNFCPage;
