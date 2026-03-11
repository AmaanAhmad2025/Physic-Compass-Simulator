import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Dimensions,
  Pressable,
  Text,
  PanResponder,
} from "react-native";
import ReanimatedAnimated from "react-native-reanimated";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

// Constants
const MAGNET_RADIUS = 50;
const COMPASS_RADIUS = 45;
const NEEDLE_LENGTH = 32;
const NEEDLE_WIDTH = 6;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height - 100; // Account for tab bar

// Compass component with centered needle (red north, blue south)
interface CompassProps {
  x: number;
  y: number;
  angle: number;
  colors: any;
}

const Compass: React.FC<CompassProps> = ({ x, y, angle, colors }) => {
  const animatedAngle = useSharedValue(angle);

  useEffect(() => {
    animatedAngle.value = withTiming(angle, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  }, [angle, animatedAngle]);

  const needleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${animatedAngle.value}deg` }],
    };
  });

  return (
    <View
      style={{
        position: "absolute",
        left: x - COMPASS_RADIUS,
        top: y - COMPASS_RADIUS,
        width: COMPASS_RADIUS * 2,
        height: COMPASS_RADIUS * 2,
        borderRadius: COMPASS_RADIUS,
        backgroundColor: colors.surface,
        borderWidth: 3,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      {/* Cardinal direction markers */}
      <Text
        style={{
          position: "absolute",
          top: 8,
          fontSize: 12,
          fontWeight: "bold",
          color: colors.muted,
        }}
      >
        N
      </Text>
      <Text
        style={{
          position: "absolute",
          bottom: 8,
          fontSize: 12,
          fontWeight: "bold",
          color: colors.muted,
        }}
      >
        S
      </Text>
      <Text
        style={{
          position: "absolute",
          left: 8,
          fontSize: 10,
          fontWeight: "bold",
          color: colors.muted,
        }}
      >
        W
      </Text>
      <Text
        style={{
          position: "absolute",
          right: 8,
          fontSize: 10,
          fontWeight: "bold",
          color: colors.muted,
        }}
      >
        E
      </Text>

      {/* Compass needle - centered with red top (north) and blue bottom (south) */}
      <ReanimatedAnimated.View
        style={[
          {
            position: "absolute",
            width: NEEDLE_WIDTH,
            height: NEEDLE_LENGTH,
            borderRadius: NEEDLE_WIDTH / 2,
            overflow: "hidden",
          },
          needleStyle,
        ]}
      >
        {/* Red half (North) */}
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#EF4444",
          }}
        />
        {/* Blue half (South) */}
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#3B82F6",
          }}
        />
      </ReanimatedAnimated.View>

      {/* Center dot */}
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: colors.foreground,
          zIndex: 10,
        }}
      />
    </View>
  );
};

// Magnet component - vertical with red (N) on top and blue (S) on bottom
interface MagnetProps {
  x: number;
  y: number;
  colors: any;
}

const Magnet: React.FC<MagnetProps> = ({ x, y, colors }) => {
  return (
    <View
      style={{
        position: "absolute",
        left: x - MAGNET_RADIUS,
        top: y - MAGNET_RADIUS,
        width: MAGNET_RADIUS * 2,
        height: MAGNET_RADIUS * 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* North pole (Red) - Top */}
      <View
        style={{
          position: "absolute",
          width: MAGNET_RADIUS * 1.8,
          height: MAGNET_RADIUS,
          borderTopLeftRadius: MAGNET_RADIUS / 2,
          borderTopRightRadius: MAGNET_RADIUS / 2,
          backgroundColor: "#EF4444",
          top: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>N</Text>
      </View>

      {/* South pole (Blue) - Bottom */}
      <View
        style={{
          position: "absolute",
          width: MAGNET_RADIUS * 1.8,
          height: MAGNET_RADIUS,
          borderBottomLeftRadius: MAGNET_RADIUS / 2,
          borderBottomRightRadius: MAGNET_RADIUS / 2,
          backgroundColor: "#3B82F6",
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>S</Text>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const colors = useColors();
  const [magneticFieldEnabled, setMagneticFieldEnabled] = useState(false);
  const [compassPos, setCompassPos] = useState({ x: SCREEN_WIDTH * 0.75, y: SCREEN_HEIGHT * 0.7 });
  const [compassAngle, setCompassAngle] = useState(0);
  const panResponder = useRef<any>(null);

  // Magnet position (center of screen)
  const magnetX = SCREEN_WIDTH / 2;
  const magnetY = SCREEN_HEIGHT / 2;

  // Calculate compass needle angle based on magnet position
  const calculateAngle = useCallback((compassX: number, compassY: number): number => {
    if (!magneticFieldEnabled) {
      return 0; // Point north when field is off
    }

    // Vector from compass to magnet
    const dx = magnetX - compassX;
    const dy = magnetY - compassY;

    // Calculate angle in radians, then convert to degrees
    let angleRad = Math.atan2(dx, -dy); // -dy because y increases downward
    let angleDeg = (angleRad * 180) / Math.PI;

    // Normalize to 0-360
    if (angleDeg < 0) {
      angleDeg += 360;
    }

    return angleDeg;
  }, [magneticFieldEnabled, magnetX, magnetY]);

  // Update compass angle when position or field state changes
  useEffect(() => {
    const newAngle = calculateAngle(compassPos.x, compassPos.y);
    setCompassAngle(newAngle);
  }, [compassPos, magneticFieldEnabled, calculateAngle]);

  // Initialize PanResponder for drag interactions
  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { moveX, moveY } = gestureState;

        // Clamp position to screen bounds
        const newX = Math.max(COMPASS_RADIUS, Math.min(SCREEN_WIDTH - COMPASS_RADIUS, moveX));
        const newY = Math.max(COMPASS_RADIUS, Math.min(SCREEN_HEIGHT - COMPASS_RADIUS, moveY));

        setCompassPos({ x: newX, y: newY });
      },
    });
  }, []);

  // Handle magnetic field toggle
  const handleToggleMagneticField = () => {
    setMagneticFieldEnabled(!magneticFieldEnabled);
  };

  return (
    <ScreenContainer className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Canvas area */}
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            position: "relative",
          }}
          {...panResponder.current?.panHandlers}
        >
          {/* Magnet at center */}
          <Magnet x={magnetX} y={magnetY} colors={colors} />

          {/* Draggable compass */}
          <Compass x={compassPos.x} y={compassPos.y} angle={compassAngle} colors={colors} />
        </View>

        {/* Control panel */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            padding: 16,
            gap: 12,
          }}
        >
          {/* Magnetic field toggle button */}
          <Pressable
            onPress={handleToggleMagneticField}
            style={({ pressed }) => [
              {
                backgroundColor: magneticFieldEnabled ? colors.primary : colors.muted,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              Magnetic Field: {magneticFieldEnabled ? "ON" : "OFF"}
            </Text>
          </Pressable>

          {/* Info text */}
          <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center" }}>
            Tap and drag the compass to move it around
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
