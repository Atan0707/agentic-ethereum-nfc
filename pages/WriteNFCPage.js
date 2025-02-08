import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import {ethers} from 'ethers';
import {WalletCtx} from '../App';
import ContractABI from '../contract/ABI.json';
import {Picker} from '@react-native-picker/picker';

NfcManager.start();

// Contract address - replace with your deployed contract address
const CONTRACT_ADDRESS = '0xFeB24f50eC7fAdC4F4e691c4f2c484d165591CdE';

const RARITY = {
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
};

const POKEMON_TYPE = {
  FIRE: 0,
  WATER: 1,
  GRASS: 2,
  ELECTRIC: 3,
  PSYCHIC: 4,
  NORMAL: 5,
};

function WriteNFCPage({navigation}) {
  const [loading, setLoading] = useState(false);
  const {providerCtx, addressCtx} = useContext(WalletCtx);

  // NFT creation states
  const [pokemonName, setPokemonName] = useState('');
  const [rarity, setRarity] = useState(RARITY.COMMON);
  const [behavior, setBehavior] = useState('');
  const [pokemonType, setPokemonType] = useState(POKEMON_TYPE.NORMAL);
  const [tokenUri, setTokenUri] = useState('');
  const [claimHash, setClaimHash] = useState('');

  async function createPokemonNFT() {
    if (!pokemonName || !behavior || !tokenUri) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const ethersProvider = new ethers.BrowserProvider(providerCtx);
      const signer = await ethersProvider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, signer);

      const tx = await contract.createPokemon(
        pokemonName,
        rarity,
        behavior,
        pokemonType,
        tokenUri
      );

      const receipt = await tx.wait();

      // Find the PokemonCreated event
      const event = receipt.events.find(e => e.event === 'PokemonCreated');
      if (event) {
        const [tokenId, hash] = event.args;
        setClaimHash(hash);
        Alert.alert('Success', `Pokemon NFT created with ID: ${tokenId}`);
        return hash; // We'll use this hash to write to NFC
      }
    } catch (error) {
      console.error('Error creating Pokemon NFT:', error);
      Alert.alert('Error', 'Failed to create Pokemon NFT');
    } finally {
      setLoading(false);
    }
  }

  async function writeNFCHash() {
    if (!claimHash) {
      Alert.alert('Error', 'Please create a Pokemon NFT first');
      return;
    }

    let result = false;
    try {
      setLoading(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.textRecord(claimHash)]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        result = true;
        Alert.alert('Success', 'Claim hash written to NFC tag');
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
    <ScrollView contentContainerStyle={styles.mainLayout}>
      <TextInput
        style={styles.input}
        placeholder="Pokemon Name"
        value={pokemonName}
        onChangeText={setPokemonName}
        placeholderTextColor={'black'}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={rarity}
          onValueChange={setRarity}
          style={styles.picker}>
          <Picker.Item label="Common" value={RARITY.COMMON} />
          <Picker.Item label="Uncommon" value={RARITY.UNCOMMON} />
          <Picker.Item label="Rare" value={RARITY.RARE} />
          <Picker.Item label="Epic" value={RARITY.EPIC} />
          <Picker.Item label="Legendary" value={RARITY.LEGENDARY} />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={pokemonType}
          onValueChange={setPokemonType}
          style={styles.picker}>
          <Picker.Item label="Fire" value={POKEMON_TYPE.FIRE} />
          <Picker.Item label="Water" value={POKEMON_TYPE.WATER} />
          <Picker.Item label="Grass" value={POKEMON_TYPE.GRASS} />
          <Picker.Item label="Electric" value={POKEMON_TYPE.ELECTRIC} />
          <Picker.Item label="Psychic" value={POKEMON_TYPE.PSYCHIC} />
          <Picker.Item label="Normal" value={POKEMON_TYPE.NORMAL} />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Behavior"
        value={behavior}
        onChangeText={setBehavior}
        placeholderTextColor={'black'}
      />

      <TextInput
        style={styles.input}
        placeholder="Token URI (IPFS or other)"
        value={tokenUri}
        onChangeText={setTokenUri}
        placeholderTextColor={'black'}
      />

      <TouchableOpacity
        onPress={createPokemonNFT}
        style={[styles.button, styles.goldButton]}>
        <Text style={styles.buttonText}>Create Pokemon NFT</Text>
      </TouchableOpacity>

      {claimHash && (
        <TouchableOpacity
          onPress={writeNFCHash}
          style={[styles.button, styles.goldButton]}>
          <Text style={styles.buttonText}>Write Claim Hash to NFC</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size={'large'} color={'#0ca973'} />}
    </ScrollView>
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
  goldButton: {
    backgroundColor: '#c59f59',
  },
  buttonText: {
    color: 'black',
  },
  pickerContainer: {
    width: '80%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
  },
  homeButtonText: {
    color: 'white',
  },
  picker: {
    width: '100%',
    color: 'black',
  },
});

export default WriteNFCPage;
