import { PixelRatio, Dimensions } from "react-native";

const pixelRatio = PixelRatio.get();
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const adjust = (size) => {
  
  // Thiết bị lớn (bao gồm cả iPad)
  if (deviceWidth >= 768 && deviceHeight >= 1024) {
    if (pixelRatio >= 3.5) {
      return size * 1.3;
    }
    return size * 1.2;
  }
  
  // Thiết bị nhỏ (điện thoại nhỏ)
  if (deviceWidth < 360) {
    return size * 0.85;
  }
  
  // Các thiết bị trung bình (bao gồm iPhone, Android)
  if (deviceHeight < 667) {
    return size * 0.9;
  }
  
  // Các thiết bị cỡ trung bình lớn hơn một chút (ví dụ iPhone 6-8, Android tương đương)
  if (deviceHeight >= 667 && deviceHeight < 812) {
    return size * 0.9;
  }
  
  // Các thiết bị lớn hơn nhưng không phải iPad (ví dụ iPhone X và các dòng iPhone sau đó)
  if (deviceHeight >= 812 && deviceHeight < 1024) {
    return size * 1;
  }

  return size; // Kích thước mặc định cho các thiết bị không rơi vào các trường hợp trên
};

export default adjust;
