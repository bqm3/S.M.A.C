import * as type from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL_ASSETS, BASE_URL_CHECKLIST } from '../../constants/config';


export const loginChecklist = (UserName, Password) => {
  return async dispatch => {
    dispatch({
      type: type.CHECKLIST_SET_LOGIN_INIT,
      payload: {
        userChecklist: null,
        authTokenChecklist: null,
        messageChecklist: null,
        isLoadingChecklist: true
      },
    });
    try {
      const response = await axios.post(
        BASE_URL_CHECKLIST + '/ent_user/login',
        {
          UserName,
          Password,
        },
      );
      if (response.status == 200) {
        const {token, user} = response.data;
        await AsyncStorage.setItem('tokenUserChecklist', token);
        dispatch({
          type: type.CHECKLIST_SET_LOGIN_SUCCESS,
          payload: {
            userChecklist: user,
            authTokenChecklist: token,
            messageChecklist: null,
            isLoadingChecklist: false
          },
        });
      }
    } catch (e) {
      dispatch({
        type: type.CHECKLIST_SET_LOGIN_FAIL,
        payload: {
          userChecklist: null,
          authTokenChecklist: null,
          messageChecklist: "Thông tin đăng nhập sai. Vui lòng thử lại!!!",
          isLoadingChecklist: false
        },
      });
    }
  };
};

export const loginAssets = (MaPMC, Password) => {
  return async dispatch => {
    dispatch({
      type: type.ASSET_SET_LOGIN_INIT,
      payload: {
        userAsset: null,
        authTokenAsset: null,
        messageAsset: null,
        isLoadingAsset: true
      },
    });
    // console.log('rin',UserName, Password)
    try {
      const response = await axios.post(
        BASE_URL_ASSETS + '/ent_user/login',
        {
          MaPMC,
          Password,
        },
      );
      if (response.status == 200) {
        const {token, user} = response.data;
        await AsyncStorage.setItem('tokenUserAsset', token);
        dispatch({
          type: type.ASSET_SET_LOGIN_SUCCESS,
          payload: {
            userAsset: user,
            authTokenAsset: token,
            messageAsset: null,
            isLoadingAsset: false
          },
        });
      }
    } catch (e) {
      console.log('asset',e)
      dispatch({
        type: type.ASSET_SET_LOGIN_FAIL,
        payload: {
          userAsset: null,
          authTokenAsset: null,
          messageAsset: "Thông tin đăng nhập sai. Vui lòng thử lại!!!",
          isLoadingAsset: false
        },
      });
    }
  };
};

export const logoutAction = () => {
  return async (dispatch) => {

    await AsyncStorage.clear();
    dispatch({
      type: type.SET_LOGOUT,
      payload: {
        userChecklist: null,
        tokenUserChecklist: null,
        isLoadingChecklist: false,
        userAsset: null,
        tokenUserAsset: null,
        isLoadingAsset: false,
      },
    });
  };
};