import { EventSubscription, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function AccelerationScreen() {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<EventSubscription | null>(
    null
  );

  const _subscribe = () => {
    // handle subscription
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      setData({ x, y, z });
    });

    setSubscription(subscription as EventSubscription);

    Accelerometer.setUpdateInterval(100); // Update every 100ms
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    // setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  // Convert acceleration to m/s²
  const accelerationX = (x * 9.81).toFixed(2);
  const accelerationY = (y * 9.81).toFixed(2);
  const accelerationZ = (z * 9.81 - 9.81).toFixed(2);
  const totalAcceleration = Math.sqrt(
    Math.pow(x * 9.81, 2) + Math.pow(y * 9.81, 2) + Math.pow(z * 9.81 - 9.81, 2)
  ).toFixed(2);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Vehicle Acceleration
      </ThemedText>

      <ThemedView style={styles.dataContainer}>
        <ThemedView style={styles.dataRow}>
          <ThemedText type="defaultSemiBold">Forward/Backward:</ThemedText>
          <ThemedText style={styles.value}>{accelerationX} m/s²</ThemedText>
        </ThemedView>

        <ThemedView style={styles.dataRow}>
          <ThemedText type="defaultSemiBold">Left/Right:</ThemedText>
          <ThemedText style={styles.value}>{accelerationY} m/s²</ThemedText>
        </ThemedView>

        <ThemedView style={styles.dataRow}>
          <ThemedText type="defaultSemiBold">Up/Down:</ThemedText>
          <ThemedText style={styles.value}>{accelerationZ} m/s²</ThemedText>
        </ThemedView>

        <ThemedView style={styles.dataRow}>
          <ThemedText type="defaultSemiBold">Total:</ThemedText>
          <ThemedText style={styles.value}>{totalAcceleration} m/s²</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.note}>
        Place your device securely in your vehicle to measure acceleration
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 40,
  },
  dataContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
  },
  note: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 20,
  },
});
