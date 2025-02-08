import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WalletCtx } from '../App';

const Navbar = ({ handleConnection }) => {
  const { addressCtx, isConnectedCtx } = useContext(WalletCtx);

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={handleConnection} style={styles.connectButton}>
        <Text style={styles.buttonText}>
          {isConnectedCtx
            ? `Connected: ${addressCtx.slice(0, 6)}...${addressCtx.slice(-4)}`
            : 'Connect Wallet'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  connectButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Navbar;
