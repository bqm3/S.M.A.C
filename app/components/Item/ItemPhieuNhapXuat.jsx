import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import adjust from "../../constants/adjust";
import moment from "moment";
import { COLORS } from "../../constants/theme";

export default function ItemPhieuNhapXuat({
  item,
  index,
  toggleTodo,
  newActionQuanlyTaisan,
}) {
  const isExistIndex = newActionQuanlyTaisan.findIndex(
    (existingItem) => existingItem.ID_PhieuNX === item.ID_PhieuNX
  );
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isExistIndex ? "white" : COLORS.bg_main,
        },
      ]}
      onPress={() => toggleTodo(item)}
    >
      <View>
        <Text
          style={[
            styles.header,
            { color: !isExistIndex ? "white" : COLORS.bg_main },
          ]}
        >
          Mã - PNX {item?.ID_PhieuNX}
        </Text>
        <View style={styles.row}>
          <View style={{ width: 150 }}>
            <Text
              allowFontScaling={false}
              style={[
                styles.title,
                { color: isExistIndex ? "black" : "white" },
              ]}
            >
              Nghiệp vụ
            </Text>
          </View>
          <Text
            allowFontScaling={false}
            style={[
              styles.title,
              { fontWeight: "500", color: isExistIndex ? "black" : "white" },
            ]}
          >
            : {item?.ent_nghiepvu?.Nghiepvu}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={{ width: 150 }}>
            <Text
              allowFontScaling={false}
              style={[
                styles.title,
                { color: isExistIndex ? "black" : "white" },
              ]}
            >
              Số phiếu
            </Text>
          </View>
          <View style={{ width: 200 }}>
            <Text
              allowFontScaling={false}
              style={[
                styles.title,
                { fontWeight: "500", color: isExistIndex ? "black" : "white" },
              ]}
            >
              : {item?.Sophieu}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={{ width: 150 }}>
            <Text
              allowFontScaling={false}
              style={[
                styles.title,
                { color: isExistIndex ? "black" : "white" },
              ]}
            >
              Ngày nhập
            </Text>
          </View>
          <Text
            allowFontScaling={false}
            style={[
              styles.title,
              { fontWeight: "500", color: isExistIndex ? "black" : "white" },
            ]}
          >
            : {moment(item?.NgayNX).format("DD/MM/YYYY")}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={{ width: 150 }}>
            <Text
              allowFontScaling={false}
              style={[
                styles.title,
                { color: isExistIndex ? "black" : "white" },
              ]}
            >
              Người nhập
            </Text>
          </View>
          <Text
            allowFontScaling={false}
            style={[
              styles.title,
              { fontWeight: "500", color: isExistIndex ? "black" : "white" },
            ]}
          >
            : {item?.ent_user?.Hoten}
          </Text>
        </View>
        <View style={styles.row}>
          <View style={{ width: 150 }}>
            <Text
              allowFontScaling={false}
              style={[
                styles.title,
                { color: isExistIndex ? "black" : "white" },
              ]}
            >
              Tình trạng
            </Text>
          </View>
          <Text
            allowFontScaling={false}
            style={[
              styles.title,
              {
                fontWeight: "600",
                color: !isExistIndex ? "white" : "green",
              },
            ]}
          >
            : Mở
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 10,
    padding: 10,
    borderRadius: 16,
  },
  header: {
    marginLeft: 10,
    fontSize: adjust(18),
    paddingVertical: 2,
    color: COLORS.bg_active,
    fontWeight: "700",
    textAlign: "left",
  },
  title: {
    paddingTop: 4,
    fontSize: adjust(16),
    paddingVertical: 2,
    color: "black",
    fontWeight: "700",
    textAlign: "left",
  },
  row: {
    marginLeft: 10,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
