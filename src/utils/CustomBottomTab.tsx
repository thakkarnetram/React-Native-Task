import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
} from 'react-native-svg';

const {width} = Dimensions.get('window');
const TAB_BAR_HEIGHT = 130;

// Wave gradient (top → bottom)
const WAVE_GRADIENT_TOP = '#cbcbcb';
const WAVE_GRADIENT_BOTTOM = '#000000';
const ACTIVE_RING_TOP = '#ffffff';
const ACTIVE_RING_BOTTOM = '#8d8d8d';
const INACTIVE_RING_TOP = '#666';
const INACTIVE_RING_BOTTOM = '#333';

const SIDE_RING_SIZE = 42;
const CENTER_RING_SIZE = 60;
const SIDE_STROKE_WIDTH = 1.5;
const CENTER_STROKE_WIDTH = 2;

function getIconSource(routeName: string) {
  switch (routeName) {
    case 'Home':
      return require('../assets/icons/home.png');
    case 'YoloPay':
      return require('../assets/icons/qrcode.png');
    case 'Ginnie':
      return require('../assets/icons/coupon.png');
    default:
      return require('../assets/icons/home.png');
  }
}

/**
 * A small helper component that draws a circular stroke gradient
 * behind its children. We use react-native-svg for the stroke gradient.
 */
const GradientRing: React.FC<{
  size: number;
  strokeWidth: number;
  topColor: string;
  bottomColor: string;
  children?: React.ReactNode;
}> = ({size, strokeWidth, topColor, bottomColor, children}) => {
  // The circle radius must account for the stroke width
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  return (
    <View style={{width: size, height: size}}>
      {/* The gradient ring (stroke only) */}
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgLinearGradient
            id="iconRingGradient"
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="1">
            <Stop offset="0%" stopColor={topColor} />
            <Stop offset="100%" stopColor={bottomColor} />
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#iconRingGradient)"
          strokeWidth={strokeWidth}
          fill="none"
        />
      </Svg>

      {/* The icon or any children, centered */}
      <View style={styles.iconWrapper}>{children}</View>
    </View>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = props => {
  const {state, descriptors, navigation} = props;
  const {routes, index: activeRouteIndex} = state;

  return (
    <View style={{width, height: TAB_BAR_HEIGHT, backgroundColor: 'black'}}>
      {/* 1) Wave background with a vertical gradient stroke */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width={width}
          height={TAB_BAR_HEIGHT}
          viewBox={`0 0 ${width} ${TAB_BAR_HEIGHT}`}>
          <Defs>
            <SvgLinearGradient
              id="waveVerticalGradient"
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="1">
              <Stop offset="0%" stopColor={WAVE_GRADIENT_TOP} />
              <Stop offset="100%" stopColor={WAVE_GRADIENT_BOTTOM} />
            </SvgLinearGradient>
          </Defs>
          <Path
            // A single arch ("camel hump") at the top
            d={`
              M0,40
              Q${width / 2},0 ${width},40
              L${width},${TAB_BAR_HEIGHT}
              L0,${TAB_BAR_HEIGHT}
              Z
            `}
            fill="#000" // black fill for the tab bar background
            stroke="url(#waveVerticalGradient)" // vertical gradient stroke
            strokeWidth={1}
          />
        </Svg>
      </View>

      {/* 2) Row of tab buttons */}
      <View style={styles.tabRow}>
        {routes.map((route, routeIndex) => {
          const isFocused = activeRouteIndex === routeIndex;
          const {options} = descriptors[route.key];
          const label =
            options.title !== undefined ? options.title : route.name;
          const iconSource = getIconSource(route.name);

          // If you have exactly 3 tabs, index 1 is the "center" tab
          const isCenter = routeIndex === 1; // adjust if you have more tabs

          // Press handler
          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name as never);
            }
          };

          // Decide ring size + stroke width for side vs. center tab
          const ringSize = isCenter ? CENTER_RING_SIZE : SIDE_RING_SIZE;
          const strokeWidth = isCenter
            ? CENTER_STROKE_WIDTH
            : SIDE_STROKE_WIDTH;

          // Decide gradient colors for active vs. inactive ring
          const topColor = isFocused ? ACTIVE_RING_TOP : INACTIVE_RING_TOP;
          const bottomColor = isFocused
            ? ACTIVE_RING_BOTTOM
            : INACTIVE_RING_BOTTOM;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabButton,
                isCenter && styles.centerTabButton, // raise center tab
              ]}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityState={isFocused ? {selected: true} : {}}
              activeOpacity={0.8}>
              {/* 3) The circular stroke gradient behind the icon */}
              <GradientRing
                size={ringSize}
                strokeWidth={strokeWidth}
                topColor={topColor}
                bottomColor={bottomColor}>
                <Image
                  source={iconSource}
                  style={[
                    isCenter ? styles.centerIcon : styles.icon,
                    {tintColor: isFocused ? '#fff' : '#666'},
                  ]}
                  resizeMode="contain"
                />
              </GradientRing>

              {/* 4) Label below the icon */}
              <Text
                style={[styles.label, {color: isFocused ? '#fff' : '#666'}]}>
                {label.toLowerCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: TAB_BAR_HEIGHT,
    paddingBottom: 8, // space for label
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTabButton: {
    marginTop: -15, // raise the center tab above the wave
  },
  // Icon sizes for side vs. center
  icon: {
    width: 24,
    height: 24,
  },
  centerIcon: {
    width: 28,
    height: 28,
  },
  // The wrapper that centers the icon inside the ring
  iconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
