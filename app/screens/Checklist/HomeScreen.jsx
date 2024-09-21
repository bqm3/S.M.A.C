//import liraries
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import ItemHome from "../../components/Item/ItemHome";
// import CopyRight from "../../components/CopyRight";
import ItemHomePSH from "../../components/Item/ItemHomePSH";
import adjust from "../../constants/adjust";
import DataContext from "../../context/DataContext";

const dataDanhMuc = [
  {
    id: 1,
    path: "Thực hiện Checklist",
    icon: require("../../../assets/icons/o-01.png"),
    role: 2,
  },
  {
    id: 2,
    path: "Tra cứu",
    icon: require("../../../assets/icons/o-02.png"),
    role: 2,
  },
  {
    id: 3,
    path: "Danh mục Khu vực",
    icon: require("../../../assets/icons/o-03.png"),
    role: 1,
  },
  {
    id: 7,
    path: "Danh mục Hạng mục",
    icon: require("../../../assets/icons/o-03.png"),
    role: 1,
  },
  {
    id: 4,
    path: "Danh mục Check list",
    icon: require("../../../assets/icons/o-04.png"),
    role: 1,
  },
  {
    id: 6,
    path: "Danh mục Ca làm việc",
    icon: require("../../../assets/icons/o-06.png"),
    role: 1,
  },
  {
    id: 5,
    path: "Danh mục Giám sát",
    icon: require("../../../assets/icons/o-05.png"),
    role: 1,
  },
];

const dataDanhMucPSH = [
  {
    id: 1,
    path: "Danh mục dự án",
  },
  {
    id: 2,
    path: "Danh mục tòa nhà",
  },
  {
    id: 3,
    path: "Quản lý người dùng",
  },
];
// create a component
const HomeScreen = ({ navigation }) => {
  
  const { authTokenChecklist, userChecklist } = useSelector((state) => state.authReducer);

  const renderItem = ({ item, index }) => (
    <ItemHome roleUser={userChecklist?.Permission} item={item} index={index} />
  );

  const renderItemPSH = ({ item, index }) => (
    <ItemHomePSH item={item} index={index} />
  );

  return (
    <ImageBackground
      source={require("../../../assets/images/background_main.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      {userChecklist?.ent_chucvu?.Chucvu == "PSH" ? (
        <>
          <View style={styles.container}>
            <View
              style={[
                styles.content,
                {
                  width: "100%",
                  alignContent: "center",
                },
              ]}
            >
              <FlatList
                style={{
                  width: "100%",
                  paddingHorizontal: 20,
                  gap: 20,
                }}
                numColumns={2}
                keyExtractor={({ item, index }) => `${index}`}
                data={dataDanhMucPSH}
                renderItem={renderItemPSH}
                // ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                contentContainerStyle={{ gap: 20 }}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  gap: 20,
                }}
              />
            </View>
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text
              allowFontScaling={false}
              style={{
                color: "white",
                fontSize: adjust(16),
              }}
              numberOfLines={1}

              // adjustsFontSizeToFit
            >
              Digital Transformation Good day and Happy
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontSize: adjust(20),
                color: "white",
                fontWeight: "700",
                textTransform: "uppercase",
                paddingTop: 8,
              }}
            >
              Dự án: {userChecklist?.ent_duan?.Duan}
            </Text>
          </View>

          <View
            style={[
              styles.content,
              {
                width: "100%",
                alignContent: "center",
              },
            ]}
          >
            <FlatList
              style={{
                width: "100%",
                paddingHorizontal: 20,
              }}
              numColumns={3}
              data={dataDanhMuc}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              contentContainerStyle={{ gap: 16 }}
              columnWrapperStyle={{ gap: 16 }}
            />
          </View>
          <View
            style={{
              flexDirection: "column",
              marginTop: 20,
              marginHorizontal: 20,
            }}
          >
            <Text
              allowFontScaling={false}
              style={{
                color: "white",
                fontSize: adjust(16),
              }}
            >
              Người Giám sát chỉ thực hiện công việc Check list, Tra cứu và Đổi
              mật khẩu.
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                color: "white",
                fontSize: adjust(16),
              }}
            >
              Giám đốc Tòa nhà toàn quyền sử dụng.
            </Text>
          </View>

          {/* <CopyRight /> */}
        </View>
      )}
    </ImageBackground>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    paddingBottom: 40,
  },
  content: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});

//make this component available to the app
export default HomeScreen;
