import React, { createContext, useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { View, Image, StyleSheet } from 'react-native';
import { useWalletConnectModal, WalletConnectModal } from '@walletconnect/modal-react-native';
import WriteNFCPage from './pages/WriteNFCPage';
import ReadNFCPage from './pages/ReadNFCPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';

// Create WalletContext
export const WalletCtx = createContext();

const Stack = createNativeStackNavigator();

// WalletConnect configuration
const projectId = '7c684784ed55bc73a74c1aaf288dd50f';
const providerMetadata = {
  name: 'NFCApp',
  description: 'NFC Reading and Writing App',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

function App() {
  const [addressCtx, setAddressCtx] = useState('0x');
  const [openCtx, setOpenCtx] = useState(null);
  const [isConnectedCtx, setIsConnectedCtx] = useState(null);
  const [providerCtx, setProviderCtx] = useState('');

  const { address, open, isConnected, provider } = useWalletConnectModal();

  const handleConnection = async () => {
    if (isConnected) {
      await provider.disconnect();
      setIsConnectedCtx(false);
      setAddressCtx('0x');
      setProviderCtx(null);
    }
    await open();
  };

  useEffect(() => {
    const initialize = async () => {
      if (provider) {
        await provider.disconnect();
      }
    };
    setAddressCtx('0x');
    setIsConnectedCtx(false);
    setProviderCtx(null);

    initialize();
  }, []);

  useEffect(() => {
    setAddressCtx(address);
    setIsConnectedCtx(isConnected);
    setProviderCtx(provider);
  }, [address, isConnected, provider]);

  return (
    <WalletCtx.Provider
      value={{
        addressCtx,
        setAddressCtx,
        openCtx,
        setOpenCtx,
        isConnectedCtx,
        setIsConnectedCtx,
        providerCtx,
        setProviderCtx,
      }}>
      <NavigationContainer>
        <View style={styles.container}>
          <Navbar handleConnection={handleConnection} />
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="WriteNFC"
              component={WriteNFCPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ReadNFC"
              component={ReadNFCPage}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <WalletConnectModal
            projectId={projectId}
            providerMetadata={providerMetadata}
            sessionParams={{
              namespaces: {
                eip155: {
                  methods: ['eth_sendTransaction', 'personal_sign'],
                  chains: ['eip155:84532'],
                  events: ['chainChanged', 'accountsChanged'],
                  rpcMap: {
                    84532: 'https://sepolia.base.org',
                  },
                },
              },
            }}
          />
        </View>
      </NavigationContainer>
    </WalletCtx.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
