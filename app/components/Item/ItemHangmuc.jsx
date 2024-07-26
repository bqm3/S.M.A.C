import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import adjust from "../../constants/adjust";

const ItemHangmuc = ({ index, item, handleEditEnt, handleAlertDelete }) => {
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
      <View style={{width: '80%'}}>
        <Text allowFontScaling={false}  style={[styles.title, { fontSize: adjust(18) }]}>
          {item?.Hangmuc}
        </Text>
        <Text allowFontScaling={false}  style={[styles.title, { fontSize: adjust(14) }]}>
          {item?.ent_khuvuc?.Tenkhuvuc}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 4,
          }}
        ></View>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginRight: 10,
          gap: 10,
        }}
      >
        <TouchableOpacity onPress={() => handleEditEnt(item)}>
          <Image
            source={require("../../../assets/icons/edit_icon.png")}
            resizeMode="contain"
            style={{ height: adjust(24), width: adjust(24) }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAlertDelete(item.ID_Hangmuc)}>
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

export default ItemHangmuc;

const styles = StyleSheet.create({
  title: { paddingVertical: 2, color: "black", fontWeight: "600" },
});
