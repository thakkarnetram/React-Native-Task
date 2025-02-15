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
import {faker} from '@faker-js/faker';
import Svg, {
  Rect,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

const {width} = Dimensions.get('window');

// Replace these with your own PNG assets
const CARD_BG = require('../assets/images/cardbg.png'); // The card background
const YES_BANK = require('../assets/images/bank.png'); // The top-right logo
const LOGO = require('../assets/images/logo.png'); // YOLO top-left
const FREEZE_ICON = require('../assets/images/freeze.png'); // Snowflake or freeze icon
const RUPAY_LOGO = require('../assets/images/rupay.png'); // RuPay PREPAID
const FREEZE_CARD_IMAGE = require('../assets/images/freezecard.png'); // Frost image

// Gradient stroke button for "pay" / "card"
interface GradientStrokeButtonProps {
  label: string;
  isActive: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
}

const GradientStrokeButton: React.FC<GradientStrokeButtonProps> = ({
  label,
  isActive,
  onPress,
  width = 100,
  height = 40,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{marginRight: 8}}>
      <View style={{width, height}}>
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient id="tabGradient" x1="0.5" y1="0" x2="0.5" y2="1">
              <Stop offset="0%" stopColor="#ff0021" />
              <Stop offset="100%" stopColor="#000000" />
            </SvgLinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            rx={8}
            ry={8}
            fill={isActive ? '#fff' : 'transparent'}
            stroke="url(#tabGradient)"
            strokeWidth={2}
          />
        </Svg>

        <View style={styles.tabInner}>
          <Text style={[styles.tabLabel, isActive && {color: '#000'}]}>
            {label.toLowerCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Gradient stroke icon button for the freeze
interface GradientStrokeIconButtonProps {
  icon: any;
  label: string;
  isActive: boolean;
  onPress?: () => void;
  width?: number;
  height?: number;
}

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
      style={{alignItems: 'center', top: 160, right: 50}}>
      <View style={{width, height, marginBottom: 6}}>
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient
              id="freezeGradient"
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="1">
              <Stop offset="0%" stopColor="#ff0000" />
              <Stop offset="100%" stopColor="#000000" />
            </SvgLinearGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width="100%"
            height="100%"
            rx={30}
            ry={30}
            fill={isActive ? '#fff' : 'transparent'}
            stroke="url(#freezeGradient)"
            strokeWidth={2}
          />
        </Svg>
        <View style={styles.iconButtonInner}>
          <Image
            source={icon}
            style={[styles.freezeIcon, isActive && {tintColor: '#000'}]}
          />
        </View>
      </View>
      <Text style={styles.freezeLabel}>{label.toLowerCase()}</Text>
    </TouchableOpacity>
  );
};

export default function YoloPayScreen() {
  // Card data
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [showCVV, setShowCVV] = useState(false);
  // Active tab
  const [activeTab, setActiveTab] = useState<'pay' | 'card'>('card');
  const sanitizedNumber = cardNumber.replace(/\D/g, '');
  const chunks = sanitizedNumber.match(/.{1,4}/g) || [];
  // Freeze animation
  const [isFrozen, setIsFrozen] = useState(false);
  const freezeAnim = useRef(new Animated.Value(1)).current;

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

  const handleFreezeToggle = () => {
    if (isFrozen) {
      Animated.timing(freezeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setIsFrozen(false));
    } else {
      Animated.timing(freezeAnim, {
        toValue: 1,
        duration: 600,
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
      <Text style={styles.headerTitle}>select payment mode</Text>
      <Text style={styles.headerSubtitle}>
        choose your preferred payment method to make payment.
      </Text>

      <View style={styles.tabRow}>
        <GradientStrokeButton
          label="pay"
          isActive={activeTab === 'pay'}
          onPress={() => setActiveTab('pay')}
        />
        <GradientStrokeButton
          label="card"
          isActive={activeTab === 'card'}
          onPress={() => setActiveTab('card')}
        />
      </View>

      <Text style={styles.cardLabel}>YOUR DIGITAL DEBIT CARD</Text>

      <View style={styles.mainRow}>
        <View style={isFrozen ? styles.frozenContainer : styles.cardContainer}>
          <ImageBackground
            source={isFrozen ? FREEZE_CARD_IMAGE : CARD_BG}
            style={isFrozen ? styles.frozenBackground : styles.cardBackground}
            imageStyle={{borderRadius: 12}}>
            <View style={styles.cardContent}>
              <View style={styles.topRow}>
                <Image
                  source={LOGO}
                  style={isFrozen ? {opacity: 0} : styles.yoloLogo}
                />
                <Image
                  source={YES_BANK}
                  style={isFrozen ? {opacity: 0} : styles.bankLogo}
                />
              </View>

              <View style={isFrozen ? {opacity: 0} : styles.numberAndExpiryRow}>
                <View style={isFrozen ? {opacity: 0} : styles.numberColumn}>
                  <View style={isFrozen ? {opacity: 0} : styles.cardNumberText}>
                    {chunks.map((chunk, index) => (
                      <Text
                        key={index}
                        style={isFrozen ? {opacity: 0} : styles.cardNumberText}>
                        {chunk}
                      </Text>
                    ))}
                  </View>
                </View>

                <View style={isFrozen ? {opacity: 0} : styles.expiryCvvColumn}>
                  <Text style={styles.expirylabel}>expiry</Text>
                  <Text style={styles.expiryText}>{cardExpiry}</Text>
                  <View style={isFrozen ? {opacity: 0} : styles.cvvRow}>
                    <Text style={styles.expirylabel}>cvv</Text>
                    <Text style={styles.cvvText}>{showCVV ? cardCVV : '***'}</Text>
                    <View>
                      <TouchableOpacity onPress={() => setShowCVV(!showCVV)}>
                        <Image
                          source={require('../assets/icons/eye.png')}
                          style={{width: 30, height: 30, left: 5}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleCopyDetails}
                style={isFrozen ? {opacity: 0} : {flexDirection: 'row'}}>
                <Image
                  source={require('../assets/icons/copy.png')}
                  style={styles.copyIcon}
                />
                <Text style={styles.copyText}>copy details</Text>
              </TouchableOpacity>

              <Image
                source={RUPAY_LOGO}
                style={isFrozen ? {opacity: 0} : styles.rupayLogo}
              />
            </View>
          </ImageBackground>
        </View>

        {/* Freeze button */}
        <GradientStrokeIconButton
          icon={FREEZE_ICON}
          label={isFrozen ? 'unfreeze' : 'freeze'}
          isActive={isFrozen}
          onPress={handleFreezeToggle}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerTitle: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    marginTop: 20,
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
  },
  tabRow: {
    marginTop: 30,
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  tabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    color: '#999',
    fontWeight: '500',
  },
  cardLabel: {
    marginTop: 20,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 5,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginTop: 30,
    width: 250,
    height: 400,
    padding: 8,
    marginVertical: 4,
    borderWidth: 0.2,
    borderRadius: 8,
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  frozenContainer: {
    marginTop: 30,
    width: 250,
    height: 400,
    padding: 8,
    marginVertical: 4,
    borderWidth: 0.2,
    borderRadius: 20,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  frozenBackground: {
    width: '120%',
    height: '120%',
    right: 15,
    bottom: 60,
  },
  cvvText: {
    top: 12,
    fontSize: 25,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yoloLogo: {
    width: 60,
    height: 25,
    resizeMode: 'contain',
  },
  bankLogo: {
    width: 80,
    height: 30,
    resizeMode: 'contain',
  },
  numberAndExpiryRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  numberColumn: {
    flexDirection: 'column',
    marginRight: 16,
  },
  cardNumberText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  expiryCvvColumn: {
    justifyContent: 'flex-start',
  },
  expirylabel: {
    color: '#a9a9a9',
    fontSize: 15,
    marginBottom: 10,
    left: 20,
  },
  expiryText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    left: 20,
  },
  cvvRow: {
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
  copyIcon: {
    width: 20,
    height: 20,
    marginTop: 10,
    tintColor: 'red',
  },
  copyText: {
    color: '#ff0000',
    fontSize: 16,
    marginTop: 10,
    marginLeft: 5,
  },
  rupayLogo: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  // Freeze overlay container
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
    fontWeight: '600',
  },
});
