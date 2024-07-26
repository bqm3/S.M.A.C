import * as type from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL_CHECKLIST } from "../../constants/config";

export const tb_checklistc_get = (pag) => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(
          BASE_URL_CHECKLIST +
            `/tb_checklistc/?page=${pag.page}&limit=${pag.limit}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data;
        dispatch({
          type: type.SET_TB_CHECKLISTC_SUCCESS,
          payload: {
            tb_checklistc: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (error) {
      console.log("errd", error.response.data.message);
    }
  };
};
