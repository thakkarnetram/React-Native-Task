import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';

// For generating random card data
import {faker} from '@faker-js/faker';

// For drawing a gradient stroke
import Svg, {
  Rect,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

// Screen width for layout
const {width} = Dimensions.get('window');

// Replace these with your actual PNG assets
const CARD_BG = require('../assets/images/cardbg.png');
const YES_BANK = require('../assets/images/bank.png');
const EYE_SLASH = require('../assets/images/eye.png');
const FREEZE_ICON = require('../assets/images/freeze.png');

// -------------- GradientStrokeButton (for pay/card tabs) -------------- //
interface GradientStrokeButtonProps {
  label: string;
  isActive: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
}

// This component draws a rectangle with a vertical gradient stroke
// and centers a text label inside. If isActive=true, it fills the rect with white.
const GradientStrokeButton: React.FC<GradientStrokeButtonProps> = ({
  label,
  isActive,
  onPress,
  width = 200,
  height = 120,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{marginRight: 8}}>
      <View style={{width, height}}>
        {/* The SVG stroke background */}
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient id="tabGradient" x1="0.5" y1="0" x2="0.5" y2="1">
              {/* Adjust these colors to your preference */}
              <Stop offset="0%" stopColor="#ff0021" />
              <Stop offset="100%" stopColor="#ff00ff" />
            </SvgLinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            rx={8} // corner radius
            ry={8}
            fill={isActive ? '#fff' : 'transparent'}
            stroke="url(#tabGradient)"
            strokeWidth={2}
          />
        </Svg>

        {/* Centered label */}
        <View style={styles.tabInner}>
          <Text style={[styles.tabLabel, isActive && {color: '#000'}]}>
            {label.toLowerCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// -------------- GradientStrokeIconButton (for freeze) -------------- //
interface GradientStrokeIconButtonProps {
  icon: any; // PNG require
  label: string;
  isActive: boolean; // If you want a different fill for active
  onPress?: () => void;
  width?: number;
  height?: number;
}

// Similar concept, but we place an icon + text inside
const GradientStrokeIconButton: React.FC<GradientStrokeIconButtonProps> = ({
  icon,
  label,
  isActive,
  onPress,
  width = 60,
  height = 60,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{alignItems: 'center'}}>
      <View style={{width, height, marginBottom: 6}}>
        {/* The SVG stroke background */}
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient
              id="freezeGradient"
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="1">
              <Stop offset="0%" stopColor="#ff0000" />
              <Stop offset="100%" stopColor="#ff00ff" />
            </SvgLinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            rx={30} // make it circular if width=height
            ry={30}
            fill={isActive ? '#fff' : 'transparent'}
            stroke="url(#freezeGradient)"
            strokeWidth={2}
          />
        </Svg>

        {/* Centered icon */}
        <View style={styles.iconButtonInner}>
          <Image
            source={icon}
            style={[styles.freezeIcon, isActive && {tintColor: '#000'}]}
          />
        </View>
      </View>
      {/* Label below */}
      <Text style={styles.freezeLabel}>{label.toLowerCase()}</Text>
    </TouchableOpacity>
  );
};

// -------------- Main PaymentScreen -------------- //
export default function YoloPayScreen() {
  // Generate random card data
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  // Track which tab is active
  const [activeTab, setActiveTab] = useState<'pay' | 'card'>('card');

  useEffect(() => {
    const number = faker.finance.creditCardNumber();
    const month = faker.helpers.arrayElement([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ]);
    const year = faker.helpers.arrayElement([
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
    ]);
    const cvv = faker.finance.creditCardCVV();

    setCardNumber(number);
    setCardExpiry(`${month}/${year}`);
    setCardCVV(cvv);
  }, []);

  // Freeze animation
  const [isFrozen, setIsFrozen] = useState(false);
  const freezeAnim = useRef(new Animated.Value(0)).current;

  const handleFreezeToggle = () => {
    if (isFrozen) {
      Animated.timing(freezeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setIsFrozen(false));
    } else {
      Animated.timing(freezeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setIsFrozen(true));
    }
  };

  const handleCopyDetails = () => {
    Alert.alert(
      'Copied Details',
      `Number: ${cardNumber}\nExpiry: ${cardExpiry}\nCVV: ${cardCVV}`,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>select payment mode</Text>
      <Text style={styles.headerSubtitle}>
        choose your preferred payment method to make payment.
      </Text>

      {/* Tabs (with gradient stroke) */}
      <View style={styles.tabRow}>
        <GradientStrokeButton
          label="pay"
          isActive={activeTab === 'pay'}
          onPress={() => setActiveTab('pay')}
          width={100}
          height={40}
        />
        <GradientStrokeButton
          label="card"
          isActive={activeTab === 'card'}
          onPress={() => setActiveTab('card')}
          width={100}
          height={40}
        />
      </View>

      <Text style={styles.cardLabel}>YOUR DIGITAL DEBIT CARD</Text>

      {/* Main row: Card (left) + Freeze button (right) */}
      <View style={styles.mainRow}>
        {/* Card container */}
        <View style={styles.cardContainer}>
          <ImageBackground
            source={CARD_BG}
            style={styles.cardBackground}
            imageStyle={{borderRadius: 12}}>
            {/* Card content */}
            <View style={styles.cardContent}>
              {/* Top row: YOLO + Yes Bank */}
              <View style={styles.topRow}>
                <Image source={require('../assets/images/logo.png')} />
                <Image source={YES_BANK} style={styles.bankLogo} />
              </View>

              {/* Card Number */}
              <View style={styles.cardNumberRow}>
                <Text style={styles.cardNumberText}>
                  {cardNumber.slice(0, 4)}
                </Text>
                <Text style={styles.cardNumberText}>
                  {cardNumber.slice(4, 8)}
                </Text>
                <Text style={styles.cardNumberText}>
                  {cardNumber.slice(8, 12)}
                </Text>
                <Text style={styles.cardNumberText}>
                  {cardNumber.slice(12, 16)}
                </Text>
              </View>

              {/* Expiry + CVV */}
              <View style={styles.infoRow}>
                <Text style={styles.expiryText}>expiry {cardExpiry}</Text>
                <View style={styles.cvvContainer}>
                  <Text style={styles.cvvLabel}>cvv</Text>
                  <Text style={styles.cvvValue}>***</Text>
                  <Image source={EYE_SLASH} style={styles.eyeIcon} />
                </View>
              </View>

              {/* Copy details + brand */}
              <TouchableOpacity onPress={handleCopyDetails}>
                <Text style={styles.copyText}>copy details</Text>
              </TouchableOpacity>
              <Image source={require('../assets/images/rupay.png')} />
            </View>

            {/* Frost overlay */}
            <Animated.View>
              {isFrozen && (
                <View style={styles.frozenTextContainer}>
                  <Image source={require('../assets/images/freezecard.png')} />
                </View>
              )}
            </Animated.View>
          </ImageBackground>
        </View>

        {/* Freeze button (with gradient stroke) */}
        <GradientStrokeIconButton
          icon={FREEZE_ICON}
          label={isFrozen ? 'unfreeze' : 'freeze'}
          isActive={isFrozen}
          onPress={handleFreezeToggle}
          width={60}
          height={60}
        />
      </View>
    </SafeAreaView>
  );
}

// -------------- Styles -------------- //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // black background
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Header
  headerTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
  },
  // Tab row
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  // Card label
  cardLabel: {
    color: '#777',
    fontSize: 14,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  // Main row
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Card container
  cardContainer: {
    marginTop: 50,
    backgroundColor: 'white',
    width: width * 0.45, // smaller than before
    height: width * 0.81, // keep ratio to not be too big
  },
  cardBackground: {
    flex: 1,
    borderRadius: 12,
    width: 250,
    height: 500,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandText: {
    color: '#a62929',
    fontSize: 18,
    fontWeight: '700',
  },
  bankLogo: {
    width: 50,
    height: 20,
    resizeMode: 'contain',
  },
  cardNumberRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  cardNumberText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
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
    marginRight: 4,
  },
  eyeIcon: {
    width: 14,
    height: 14,
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
  frozenTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:180,
  },
  frozenText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
  },
  // Freeze Icon Button
  iconButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  freezeIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  freezeLabel: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
