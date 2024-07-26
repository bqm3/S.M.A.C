import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { COLORS } from "../../constants/theme";
import Button from "../../components/Button/Button";

export default function QRCodeScreen({
  setModalVisibleQr,
  setOpacity,
  handlePushDataFilterQr,
  setIsScan,
}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setIsScan(true);
    setScanned(true);
    if ((type, data)) {
      handlePushDataFilterQr(data);
    }
  };

  if (hasPermission === null) {
    return <Text allowFontScaling={false}>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text allowFontScaling={false}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", height: "100%" }}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: 12 }]}
        />
      </View>
      {/* {scanned && ( */}
      <View
        style={{
          position: "absolute",
          bottom: 40,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          text={"Đóng"}
          backgroundColor={"white"}
          color={"black"}
          onPress={() => {
            setModalVisibleQr(false);
            setOpacity(1);
          }}
        />
        <Button
          text={"Quét lại"}
          backgroundColor={COLORS.bg_button}
          color={"white"}
          onPress={() => setScanned(false)}
        />
      </View>
      {/* )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
