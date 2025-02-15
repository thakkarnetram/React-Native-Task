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
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

// Screen width for the SVG path
const {width} = Dimensions.get('window');

// Gradient colors for the outline
const GRADIENT_START = '#ff0000';
const GRADIENT_END = '#ff00ff';

// Height of the custom tab bar
const TAB_BAR_HEIGHT = 80;

// Utility function to get the right icon for each route
// Replace the require() paths with your own icon files
function getIconSource(routeName: string) {
  switch (routeName) {
    case 'Home':
      return require('../assets/icons/home.png');
    case 'YoloPay':
      return require('../assets/icons/qrcode.png');
    case 'Ginnie':
      return require('../assets/icons/coupon.png');
    default:
      return require('../assets/icons/home.png'); // fallback icon
  }
}

const CustomTabBar: React.FC<BottomTabBarProps> = props => {
  const {state, descriptors, navigation} = props;
  const {routes, index: activeRouteIndex} = state;

  return (
    <View style={{width, height: TAB_BAR_HEIGHT}}>
      {/* The SVG "background" with a gradient stroke at the top */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg
          width={width}
          height={TAB_BAR_HEIGHT}
          viewBox={`0 0 ${width} ${TAB_BAR_HEIGHT}`}>
          <Defs>
            <SvgLinearGradient id="outlineGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={GRADIENT_START} />
              <Stop offset="100%" stopColor={GRADIENT_END} />
            </SvgLinearGradient>
          </Defs>
          <Path
            d={`
              M0,20
              C${width * 0.25},0 ${width * 0.75},0 ${width},20
              L${width},${TAB_BAR_HEIGHT}
              L0,${TAB_BAR_HEIGHT}
              Z
            `}
            fill="#000" // black fill for the bar
            stroke="url(#outlineGradient)" // gradient stroke
            strokeWidth={2}
          />
        </Svg>
      </View>

      {/* Actual tab buttons (icons + labels) */}
      <View style={[styles.tabRow, {width}]}>
        {routes.map((route, routeIndex) => {
          const isFocused = activeRouteIndex === routeIndex;
          const {options} = descriptors[route.key];
          const label =
            options.title !== undefined ? options.title : route.name;

          // Get the appropriate icon from our local assets
          const iconSource = getIconSource(route.name);

          // Handle navigation
          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name as never);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityState={isFocused ? {selected: true} : {}}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.9}>
              {/* Circular gradient around the icon */}
              <LinearGradient
                colors={
                  isFocused ? [GRADIENT_START, GRADIENT_END] : ['#333', '#444']
                }
                style={styles.iconRing}>
                <Image
                  source={iconSource}
                  style={[
                    styles.icon,
                    {tintColor: isFocused ? '#fff' : '#666'},
                  ]}
                  resizeMode="contain"
                />
              </LinearGradient>

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
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
