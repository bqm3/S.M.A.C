import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import adjust from "../../constants/adjust";

export default function ItemHome({ item, index, roleUser }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      disabled={roleUser !== 1 && item?.role === 1 ? true : false}
      onPress={() => {
        navigation.navigate(item.path);
      }}
      style={[
        {
          flexGrow: 1,
          width: "30%",
          position: "relative",
          backgroundColor:
            roleUser !== 1 && item?.role === 1
              ? COLORS.bg_active
              : COLORS.bg_white,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
        },
        item.id == 2 && item.id == 5 && { marginHorizontal: 10 },
      ]}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 6,
        }}
      >
        <Image
          source={item.icon}
          resizeMode="contain"
          style={{ width: adjust(30), height: adjust(30) }}
        />
        <Text allowFontScaling={false}
        
          style={{
            color: roleUser !== 1 && item?.role === 1 ? 'white' : 'black',
            fontSize: adjust(16),
            fontWeight: "600",
            padding: 6,
            textAlign: "center",
          }}
        >
          {item.path}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
