import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

interface CardProps {
  cardNumber: string; // e.g. "4123 4567 8912 3456"
  expiry: string; // e.g. "01/28"
  onCopyDetails?: () => void; // callback when user taps "copy details"
}

const Card: React.FC<CardProps> = ({
  cardNumber,
  expiry,
  onCopyDetails,
}) => {
  return (
    <ImageBackground
      // Replace with your own background image or remove if you want a solid color
      source={require('../assets/images/cardbg.png')}
      style={styles.cardBackground}
      imageStyle={styles.cardImageStyle}>
      <View style={styles.container}>
        {/* Top row: YOLO brand + Yes Bank logo */}
        <View style={styles.topRow}>
          <Text style={styles.brand}>YOLO</Text>
          <Image
            source={require('../assets/images/bank.png')} // Replace with your actual bank logo
            style={styles.bankLogo}
          />
        </View>

        {/* Card number */}
        <View style={styles.cardNumberContainer}>
          {/* This splits the cardNumber into 4 segments if it's 16 digits */}
          <Text style={styles.cardNumberText}>{cardNumber.slice(0, 4)}</Text>
          <Text style={styles.cardNumberText}>{cardNumber.slice(4, 8)}</Text>
          <Text style={styles.cardNumberText}>{cardNumber.slice(8, 12)}</Text>
          <Text style={styles.cardNumberText}>{cardNumber.slice(12, 16)}</Text>
        </View>

        {/* Expiry + CVV row */}
        <View style={styles.infoRow}>
          <Text style={styles.expiryText}>expiry {expiry}</Text>
          <View style={styles.cvvContainer}>
            <Text style={styles.cvvLabel}>cvv</Text>
            {/* Masked CVV */}
            <Text style={styles.cvvValue}>****</Text>
            {/* Example “hidden” icon */}
            <Image
              source={require('../assets/images/eye.png')}
              style={styles.eyeIcon}
            />
          </View>
        </View>

        {/* Copy details + card type */}
        <TouchableOpacity onPress={onCopyDetails}>
          <Text style={styles.copyText}>copy details</Text>
        </TouchableOpacity>

        <Text style={styles.rupayText}>RuPay PREPAID</Text>
      </View>
    </ImageBackground>
  );
};

export default Card;

const styles = StyleSheet.create({
  cardBackground: {
    width: 280,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImageStyle: {
    borderRadius: 12,
    resizeMode: 'cover', // or 'contain' if you prefer
  },
  container: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#ff0000',
    fontSize: 18,
    fontWeight: '700',
  },
  bankLogo: {
    width: 50,
    height: 20,
    resizeMode: 'contain',
  },
  cardNumberContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cardNumberText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  expiryText: {
    color: '#fff',
    fontSize: 14,
  },
  cvvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cvvLabel: {
    color: '#fff',
    fontSize: 14,
    marginRight: 4,
  },
  cvvValue: {
    color: '#fff',
    fontSize: 14,
  },
  eyeIcon: {
    width: 16,
    height: 16,
    marginLeft: 6,
    tintColor: '#fff',
  },
  copyText: {
    color: '#ff0000',
    fontSize: 14,
    marginTop: 10,
  },
  rupayText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 6,
  },
});
