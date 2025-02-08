import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

function ReadNFCPage({navigation}) {
  const [loading, setLoading] = useState(false);
  const [tagContent, setTagContent] = useState(null);

  async function readNdef() {
    try {
      setLoading(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const tag = await NfcManager.getTag();
      const ndefRecords = tag.ndefMessage;

      if (ndefRecords && ndefRecords.length > 0) {
        const decoded = ndefRecords.map(record => {
          const {payload, type} = record;
          // Convert payload bytes to string, removing language code (first byte) if present
          const payloadText = String.fromCharCode(...payload.slice(payload[0] + 1));
          const typeText = String.fromCharCode(...type);

          return {
            type: typeText,
            value: payloadText,
          };
        });

        setTagContent(decoded);
        Alert.alert('Success', 'Tag read successfully');
      } else {
        Alert.alert('Error', 'No NDEF records found on tag');
      }
    } catch (ex) {
      console.warn(ex);
      Alert.alert('Error', 'Failed to read NFC tag');
    } finally {
      NfcManager.cancelTechnologyRequest();
      setLoading(false);
    }
  }

  const renderTagContent = () => {
    if (!tagContent) return null;

    return tagContent.map((record, index) => (
      <View key={index} style={styles.recordContainer}>
        <Text style={styles.recordType}>Type: {record.type}</Text>
        <Text style={styles.recordValue}>Content: {record.value}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.mainLayout}>
      <TouchableOpacity
        onPress={readNdef}
        style={[styles.button, {backgroundColor: '#c59f59'}]}>
        <Text style={{color: 'black'}}>Scan NFC Tag</Text>
      </TouchableOpacity>

      {tagContent && (
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Tag Content:</Text>
          {renderTagContent()}
        </View>
      )}

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
  homeButton: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: 'black',
    marginTop: 20,
  },
  contentContainer: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 20,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  recordContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  recordType: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  recordValue: {
    fontSize: 14,
    color: 'black',
  },
});

export default ReadNFCPage;
