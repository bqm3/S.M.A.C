import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLORS, SIZES} from '../../constants/theme';
import adjust from '../../constants/adjust';

const Button = ({onPress, text, backgroundColor, color, border, width, isLoading}) => {
  return (
    <TouchableOpacity
      disabled={isLoading}
      style={{
        backgroundColor: backgroundColor ? backgroundColor : 'white',
        padding: SIZES.padding,
        borderRadius: SIZES.borderRadius,
        borderColor: border ? border : COLORS.bg_button,
        borderWidth: 1,
        width: width || 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
      }}
      onPress={onPress}>
        {isLoading && (
        <ActivityIndicator
          style={{
            marginRight: 4,
          }}
          size="small"
          color={COLORS.bg_white}
        />
      )}
      <Text allowFontScaling={false}   
        style={{
          color: color,
          fontSize: adjust(15),
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        {text ? text : ''}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
