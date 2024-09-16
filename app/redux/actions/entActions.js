import * as type from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL_CHECKLIST } from '../../constants/config';
import moment from "moment";

export const ent_khoicv_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + "/ent_khoicv", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        console.log('data',data)
        dispatch({
          type: type.SET_ENT_KHOICV_SUCCESS,
          payload: {
            ent_khoicv: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_calv_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");

      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + "/ent_calv", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_CALV_SUCCESS,
          payload: {
            ent_calv: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_calv_filter = (id) => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");

      if (token !== null) {
        const response = await axios.post(BASE_URL_CHECKLIST + `/ent_calv`,{ID_KhoiCV: id}, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_CALV_SUCCESS,
          payload: {
            ent_calv: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_giamsat_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + "/ent_giamsat", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_GIAMSAT_SUCCESS,
          payload: {
            ent_giamsat: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_toanha_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + "/ent_toanha", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_TOANHA_SUCCESS,
          payload: {
            ent_toanha: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_khuvuc_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.post(BASE_URL_CHECKLIST + "/ent_khuvuc/filter",{}, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_KHUVUC_SUCCESS,
          payload: {
            ent_khuvuc: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err ent_khuvuc_get", err.response.data.message);
    }
  };
};

export const ent_duan_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + "/ent_duan", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_DUAN_SUCCESS,
          payload: {
            ent_duan: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_chucvu_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + "/ent_chucvu", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_CHUCVU_SUCCESS,
          payload: {
            ent_chucvu: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_checklist_get = (pag) => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + `/ent_checklist/?page=${pag.page}&limit=${pag.limit}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data;
        dispatch({
          type: type.SET_ENT_CHECKLIST_SUCCESS,
          payload: {
            ent_checklist: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
      dispatch({
        type: type.SET_ENT_CHECKLIST_FAIL,
        payload: {
          ent_checklist: [],
        },
      });
    }
  };
};

export const ent_checklist_get_detail = (ID_KhoiCV, ID_ChecklistC, ID_Calv, ID_Hangmuc) => {
  return async (dispatch) => {
    dispatch({
      type: type.SET_ENT_CHECKLIST_STATE,
      payload: {
        ent_checklist_detail: [],
        isLoading: true
      },
    });
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      
      if (token !== null) {
        const response = await axios.get(
          BASE_URL_CHECKLIST + `/ent_checklist/${ID_KhoiCV}/${ID_ChecklistC}/${ID_Calv}/${ID_Hangmuc}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_CHECKLIST_DETAIL_SUCCESS,
          payload: {
            ent_checklist_detail: data,
            isLoading: false
          },
        });
      } 
    } catch (err) {
      dispatch({
        type: type.SET_ENT_CHECKLIST_FAIL,
        payload: {
          ent_checklist_detail: [],
          isLoading: false
        },
      });
      console.log("ent_checklist_get_detail", err);
    }
  };
};

export const ent_tang_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + "/ent_tang", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_TANG_SUCCESS,
          payload: {
            ent_tang: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_hangmuc_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + "/ent_hangmuc", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_HANGMUC_SUCCESS,
          payload: {
            ent_hangmuc: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err HANGMUC", err);
    }
  };
};

export const ent_users_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      if (token !== null) {
        const response = await axios.get(BASE_URL_CHECKLIST + "/ent_user/get-online", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_USERS_SUCCESS,
          payload: {
            ent_users: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_checklist_mul_hm = (dataHangmuc, ID_Calv, ID_ChecklistC) => {
  
  return async (dispatch) => {
    dispatch({
      type: type.SET_ENT_CHECKLIST_STATE,
      payload: {
        ent_checklist_detail: [],
        isLoading: true
      },
    });
    try {
      const token = await AsyncStorage.getItem("tokenUserChecklist");
      
      if (token !== null) {
        const response = await axios.put(
          `${BASE_URL_CHECKLIST}/ent_checklist/filter-mul/${ID_ChecklistC}/${ID_Calv}`,
          { ID_Hangmuc: dataHangmuc },
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data.data;
        const processedData = data?.map((item) => {
          return {
            ...item,
            Giatrinhan: item?.Giatrinhan?.split("/"),
            valueCheck: null,
            GhichuChitiet: "",
            ID_ChecklistC: ID_ChecklistC,
            Anh: null,
            gioht: moment().format("LTS"),
          };
        });
        dispatch({
          type: type.SET_ENT_CHECKLIST_DETAIL_SUCCESS,
          payload: {
            ent_checklist_detail: processedData,
            isLoading: false
          },
        });
      } 
    } catch (err) {
      dispatch({
        type: type.SET_ENT_CHECKLIST_FAIL,
        payload: {
          ent_checklist_detail: [],
          isLoading: false
        },
      });
      console.log("ent_checklist_get_detail", err);
    }
  };
}