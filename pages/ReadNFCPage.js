import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { nfcManager } from '../utils/nfcManager';

const ReadNFCPage = () => {
  const [nfcData, setNfcData] = useState(null);

  const readNFC = async () => {
    const result = await nfcManager.readNFCTag();
    if (result) {
      setNfcData(result);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Read NFC Tag" onPress={readNFC} />
      <ScrollView style={styles.dataContainer}>
        {nfcData && (
          <Text style={styles.data}>
            {JSON.stringify(nfcData, null, 2)}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  dataContainer: {
    marginTop: 20,
  },
  data: {
    fontSize: 14,
  },
});

export default ReadNFCPage; 