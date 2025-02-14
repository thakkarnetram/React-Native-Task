import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const GinnieScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ginnie Screen Placeholder</Text>
    </View>
  );
};

export default GinnieScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
