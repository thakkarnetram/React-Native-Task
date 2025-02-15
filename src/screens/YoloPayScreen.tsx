import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';

const YoloPayScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Yolo Screen Placeholder</Text>
    </View>
  );
};

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

export default YoloPayScreen;
