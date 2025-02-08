import NfcManager, {NfcTech} from 'react-native-nfc-manager';

// Initialize NFC Manager
NfcManager.start();

export const nfcManager = {
  // Write text to NFC tag
  writeNFCText: async (text) => {
    try {
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Create text record
      const bytes = await NfcManager.ndefHandler.getNdefMessage([{
        recordType: 'text',
        text: text,
        languageCode: 'en',
      }]);

      // Write the record
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      return true;
    } catch (error) {
      console.warn('Error writing text to NFC:', error);
      return false;
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  },

  // Write URL to NFC tag
  writeNFCUrl: async (url) => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      
      // Create URL record
      const bytes = await NfcManager.ndefHandler.getNdefMessage([{
        recordType: 'uri',
        uri: url
      }]);

      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      return true;
    } catch (error) {
      console.warn('Error writing URL to NFC:', error);
      return false;
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  },

  // Read NFC tag
  readNFCTag: async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      const ndefMessage = await NfcManager.ndefHandler.getNdefMessage();
      return {
        tag,
        ndefMessage
      };
    } catch (error) {
      console.warn('Error reading NFC:', error);
      return null;
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }
}; 