import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import adjust from "../../constants/adjust";

const ItemUser = ({ index, item, handleEditEnt, handleAlertDelete }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        marginVertical: 8,
        flexDirection: "row",
        paddingLeft: 20,
        padding: 12,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 16,
      }}
    >
      <View>
        <Text allowFontScaling={false}   style={[styles.title, { fontSize: adjust(20), fontWeight: '700' }]}>
          {item?.ent_duan?.Duan}
        </Text>
        
        <Text allowFontScaling={false}   style={styles.title}>{item?.ent_chucvu?.Chucvu} 
        {item?.ent_khoicv?.KhoiCV ? ` - ` : ``}
        {item?.ent_khoicv?.KhoiCV} </Text>
        <Text allowFontScaling={false}   style={styles.title}>Tên đăng nhập: {item?.UserName}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginRight: 10,
          gap: 16,
        }}
      >
        <TouchableOpacity onPress={() => handleEditEnt(item)}>
          <Image
            source={require("../../../assets/icons/edit_icon.png")}
            resizeMode="contain"
            style={{ height: adjust(26), width: adjust(26) }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAlertDelete(item.ID_User)}>
          <Image
            source={require("../../../assets/icons/delete_icon.png")}
            resizeMode="contain"
            style={{ height: adjust(26), width: adjust(26) }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ItemUser;

const styles = StyleSheet.create({
  title: { paddingVertical: 2, color: "black", fontWeight: "600", fontSize: adjust(15) },
});
