import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import adjust from "../../constants/adjust";

const ItemGiamSat = ({ item,handleEditEnt,handleAlertDelete ,handleToggleModal}) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        marginVertical: 8,
        flexDirection: "row",
        paddingLeft: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 16,
      }}
    >
      <View style={{ width: "70%" }}>
        <Text allowFontScaling={false}   style={[styles.title, { fontSize: adjust(18) }]}>{item.Hoten} - {item?.ent_khoicv?.KhoiCV}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical:2 }}>
          <Text allowFontScaling={false}   style={styles.title}>{item?.ent_duan?.Duan} - {item?.ent_chucvu?.Chucvu}</Text>
          <Text allowFontScaling={false}   style={styles.title}></Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Image
            source={require("../../../assets/icons/phone_icon.png")}
            resizeMode="contain"
            style={{ height: adjust(16), width: adjust(16) }}
          />
          <Text allowFontScaling={false}   style={styles.title}>{item?.Sodienthoai}</Text>
        </View>
       
      </View>
      <View
        style={{
          flexDirection: "row",
          marginRight: 10,
          gap: 12,
        }}
      >
        <TouchableOpacity
        onPress={() => handleToggleModal(true, item, "0.2")}
        >
          <Image
            source={require("../../../assets/icons/info_icon.png")}
            resizeMode="contain"
            style={{ height: adjust(24), width: adjust(24) }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEditEnt(item)}>
          <Image
            source={require("../../../assets/icons/edit_icon.png")}
            resizeMode="contain"
            style={{ height: adjust(24), width: adjust(24) }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAlertDelete(item.ID_Giamsat)}>
          <Image
            source={require("../../../assets/icons/delete_icon.png")}
            resizeMode="contain"
            style={{ height: adjust(24), width: adjust(24) }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemGiamSat;

const styles = StyleSheet.create({
  title: { paddingVertical: 2, color: "black", fontWeight: "600", fontSize: adjust(15) },
});
