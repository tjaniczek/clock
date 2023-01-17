import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';
import {useEffect} from "react";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const RADIUS = 120;
const RAD_RATIO = 0.5235987756;

const steps = new Array(12).fill(null).flatMap((_, i) => {
  const current = RAD_RATIO * i;
  const currentX = RADIUS * Math.cos(current);
  const currentY = RADIUS * Math.sin(current);

  const spring = RAD_RATIO * (i + 1.5);
  const springX = RADIUS * Math.cos(spring);
  const springY = RADIUS * Math.sin(spring);

  const bounce = RAD_RATIO * (i + 1);
  const bounceX = RADIUS * Math.cos(bounce);
  const bounceY = RADIUS * Math.sin(bounce);

  return [
      [springX /1.5, springY /1.5, currentX, currentY, 2000],
      [bounceX /1.5, bounceY /1.5, bounceX, bounceY, 300],
  ];
});

export default function App() {
  const bounce = useSharedValue([0, 0]);
  const spring = useSharedValue(steps[0].slice(2, 4));

  const animatedProps = useAnimatedProps(() => {
    return {
      d: `M150 150 c0 0 ${bounce.value[0]} ${bounce.value[1]} ${spring.value[0]} ${spring.value[1]}`,
    };
  }, []);

  useEffect(() => {
    bounce.value = withRepeat(
        withSequence(
            ...steps.map((step) => withTiming([step[0], step[1]], { duration: step[4], easing: Easing.in(Easing.quad) }))
        )
    , -1)

    spring.value = withRepeat(
        withSequence(
            ...steps.map((step) => withTiming([step[2], step[3]], { duration: step[4], easing: Easing.elastic(4) }))
        )
    , -1)

    return () => {
      cancelAnimation(bounce);
    }
  }, [])

  return (
    <View style={styles.container}>
        <Svg height="100%" width="100%" viewBox="0 0 300 300">
          <Circle
              cx="150"
              cy="150"
              r={RADIUS + 10}
              fill="#e3e3fa"
          />
            <AnimatedPath  fill="none" animatedProps={animatedProps} stroke="#88f" strokeWidth={5} />
        </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
