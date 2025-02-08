import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

// Initialize NFC Manager
NfcManager.start();

export const nfcManager = {
  // Write text to NFC tag
  writeNFCText: async (text) => {
    try {
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Format the data
      const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);

      if (bytes) {
        const tag = await NfcManager.getTag();
        if (!tag) throw Error('No tag found');
        await NfcManager.writeNdefMessage(bytes);
        return true;
      }

      return false;
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

      // Format the URL data
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(url)]);

      if (bytes) {
        const tag = await NfcManager.getTag();
        if (!tag) throw Error('No tag found');

        await NfcManager.writeNdefMessage(bytes);
        return true;
      }

      return false;
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
      const ndef = await NfcManager.getNdefMessage();
      return {
        tag,
        ndefMessage: ndef,
      };
    } catch (error) {
      console.warn('Error reading NFC:', error);
      return null;
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  },
};
