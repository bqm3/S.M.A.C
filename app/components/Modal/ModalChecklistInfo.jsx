import { StyleSheet, Text, View } from 'react-native'
import React from "react";
import { COLORS } from "../../constants/theme";
import Button from "../Button/Button";

const ModalChecklistInfo = ({ dataModal, handleToggleModal }) => {
    return (
        <View>
            <View style={{ marginBottom: 20 }}>
                <Text allowFontScaling={false}   style={styles.text}>Checklist: <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{dataModal?.Checklist}</Text></Text>
                <Text allowFontScaling={false}   style={styles.text}>
                    Giá trị định danh:{" "}
                    <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{(dataModal?.Giatridinhdanh)}
                    </Text></Text>
                <Text allowFontScaling={false}   style={styles.text}>Giá trị nhận: <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{dataModal?.Giatrinhan}</Text></Text>
                <Text allowFontScaling={false}   style={styles.text}>Mã số: <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{dataModal?.Maso}</Text></Text>
                <Text allowFontScaling={false}   style={styles.text}>Số thứ tự: <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{dataModal?.Sothutu}</Text></Text>
                <Text allowFontScaling={false}   style={styles.text}>Tên khu vực: <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{dataModal?.ent_hangmuc?.ent_khuvuc.Tenkhuvuc}</Text></Text>
                <Text allowFontScaling={false}   style={styles.text}>Khối công việc: <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{dataModal?.ent_hangmuc?.ent_khuvuc?.ent_khoicv?.KhoiCV}</Text></Text>
                <Text allowFontScaling={false}   style={styles.text}>Tòa nhà: <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{dataModal?.ent_hangmuc?.ent_khuvuc?.ent_toanha?.Toanha}</Text></Text>
                <Text allowFontScaling={false}   style={styles.text}>Tầng: <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{dataModal?.ent_tang?.Tentang}</Text></Text>
                <Text allowFontScaling={false}   style={styles.text}>Hạng mục: <Text allowFontScaling={false}   style={{ color: COLORS.bg_active }}>{dataModal?.ent_hangmuc?.Hangmuc}</Text></Text>
            </View>
            <Button
                color={'white'}
                backgroundColor={COLORS.bg_button}
                text={'Đóng'}
                onPress={() => handleToggleModal(false, null, "1")}>
            </Button>
        </View>
    )
}

export default ModalChecklistInfo

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: "black",
        fontWeight: "500",
        paddingVertical: 4,
    },
})