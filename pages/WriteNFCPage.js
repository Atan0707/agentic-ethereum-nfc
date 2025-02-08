import React, {useContext, useEffect, useState} from 'react';
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
  const {providerCtx, isConnectedCtx} = useContext(WalletCtx);
  const [loading, setLoading] = useState(false);
  const [baseContract, setBaseContract] = useState(null);
  // NFT creation states
  const [pokemonName, setPokemonName] = useState('');
  const [rarity, setRarity] = useState(RARITY.COMMON);
  const [behavior, setBehavior] = useState('');
  const [pokemonType, setPokemonType] = useState(POKEMON_TYPE.NORMAL);
  const [tokenUri, setTokenUri] = useState('');
  const [claimHash, setClaimHash] = useState('');

  useEffect(() => {
    if (isConnectedCtx && providerCtx) {
      const initializeContract = async () => {
        try {
          // For debugging
          console.log('Provider Context:', providerCtx);
          
          // Use BrowserProvider instead of Web3Provider for ethers v6
          const ethersProvider = new ethers.BrowserProvider(providerCtx);
          console.log('Ethers Provider created');
          
          const signer = await ethersProvider.getSigner();
          console.log('Signer obtained:', await signer.getAddress());
          
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            ContractABI,
            signer
          );
          console.log('Contract created');
          
          setBaseContract(contract);
        } catch (error) {
          console.error('Detailed error:', error);
          Alert.alert(
            'Wallet Error',
            'Failed to initialize contract. Please make sure your wallet is properly connected.'
          );
        }
      };
      initializeContract();
    } else {
      setBaseContract(null);
    }
  }, [isConnectedCtx, providerCtx]);

  async function createPokemonNFT() {
    if (!isConnectedCtx || !providerCtx) {
      Alert.alert('Error', 'Please connect your wallet first');
      return;
    }

    if (!baseContract) {
      Alert.alert('Error', 'Contract not initialized. Please try again.');
      return;
    }

    if (!pokemonName || !behavior || !tokenUri) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const tx = await baseContract.createPokemon(
        pokemonName,
        rarity,
        behavior,
        pokemonType,
        tokenUri
      );

      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      const emitHash = receipt.logs[0].args.hash;
      const emitTokenId = receipt.logs[0].args.tokenId;
      setClaimHash(emitHash);
      Alert.alert('Success', `Pokemon NFT created with ID: ${emitTokenId}`);
    } catch (error) {
      console.error('Error creating Pokemon NFT:', error);
      Alert.alert('Error', 'Failed to create Pokemon NFT. Make sure your wallet is connected and you have enough funds.');
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
      {!isConnectedCtx && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>Please connect your wallet first</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Pokemon Name"
        value={pokemonName}
        onChangeText={setPokemonName}
        placeholderTextColor={'black'}
      />

      <TextInput
        style={styles.input}
        placeholder="Rarity (0-4: Common, Uncommon, Rare, Epic, Legendary)"
        value={rarity.toString()}
        onChangeText={(text) => setRarity(parseInt(text, 10) || 0)}
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

      <TextInput
        style={styles.input}
        placeholder="Type (0-5: Fire, Water, Grass, Electric, Psychic, Normal)"
        value={pokemonType.toString()}
        onChangeText={(text) => setPokemonType(parseInt(text, 10) || 0)}
        keyboardType="numeric"
        placeholderTextColor={'black'}
      />

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

      {!claimHash && isConnectedCtx && baseContract && (
        <TouchableOpacity
          onPress={createPokemonNFT}
          style={[styles.button, styles.goldButton]}>
          <Text style={styles.buttonText}>Create Pokemon NFT</Text>
        </TouchableOpacity>
      )}

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
  homeButtonText: {
    color: 'white',
  },
  warningContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
  },
  warningText: {
    color: '#c62828',
    textAlign: 'center',
  },
});

export default WriteNFCPage;
