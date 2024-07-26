import { View, Text } from "react-native";
import React from "react";

const Title = ({ text, top, size, bottom }) => {
  return (
    <View>
      <Text
        allowFontScaling={false}
        style={{
          color: "white",
          fontSize: size ? size : 15,
          textAlign: "center",
          fontWeight: "bold",
          textTransform: "uppercase",
          paddingTop: top ? top : 10,
          paddingBottom: bottom ? bottom : 0,
        }}
      >
        {text ? text : ""}
      </Text>
    </View>
  );
};

export default Title;
