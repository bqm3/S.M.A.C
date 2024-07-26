import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../constants/theme";
import Button from "../Button/Button";

const ModalGiamsatInfo = ({ dataModal, handleToggleModal }) => {
  return (
    <View>
      <View style={{ marginBottom: 20 }}>
        <Text allowFontScaling={false} style={styles.text}>
          Họ tên:{" "}
          <Text allowFontScaling={false} style={{ color: COLORS.bg_active }}>
            {dataModal?.Hoten}
          </Text>
        </Text>
        <Text allowFontScaling={false} style={styles.text}>
          Giới tính:{" "}
          <Text allowFontScaling={false} style={{ color: COLORS.bg_active }}>
            {(dataModal?.Gioitinh == "nam" && "Nam") ||
              (dataModal?.Gioitinh == "nu" && "Nữ") ||
              (dataModal?.Gioitinh == "khac" && "Khác")}
          </Text>
        </Text>
        <Text allowFontScaling={false} style={styles.text}>
          Ngày sinh:{" "}
          <Text allowFontScaling={false} style={{ color: COLORS.bg_active }}>
            {dataModal?.Ngaysinh}
          </Text>
        </Text>
        <Text allowFontScaling={false} style={styles.text}>
          Số điện thoại:{" "}
          <Text allowFontScaling={false} style={{ color: COLORS.bg_active }}>
            {dataModal?.Sodienthoai}
          </Text>
        </Text>
        <Text allowFontScaling={false} style={styles.text}>
          Chức vụ:{" "}
          <Text allowFontScaling={false} style={{ color: COLORS.bg_active }}>
            {dataModal?.ent_chucvu.Chucvu}
          </Text>
        </Text>
        <Text allowFontScaling={false} style={styles.text}>
          Dự án:{" "}
          <Text allowFontScaling={false} style={{ color: COLORS.bg_active }}>
            {dataModal?.ent_duan.Duan}
          </Text>
        </Text>
        <Text allowFontScaling={false} style={styles.text}>
          Khối công việc:{" "}
          <Text allowFontScaling={false} style={{ color: COLORS.bg_active }}>
            {dataModal?.ent_khoicv.KhoiCV}
          </Text>
        </Text>
      </View>
      <Button
        color={"white"}
        backgroundColor={COLORS.bg_button}
        text={"Đóng"}
        onPress={() => handleToggleModal(false, null, "1")}
      ></Button>
    </View>
  );
};

export default ModalGiamsatInfo;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
    paddingVertical: 2,
  },
});
