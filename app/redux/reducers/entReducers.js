import * as type from "../types";
const initialState = {
  ent_khoicv: [],
  ent_calv: [],
  ent_giamsat: [],
  ent_chucvu: [],
  ent_duan: [],
  ent_khuvuc: [],
  ent_checklist: [],
  ent_checklist_detail: [],
  ent_tang: [],
  ent_toanha: [],
  ent_users: [],
  ent_hangmuc: [],
  error: false,
  isLoading: false,
  isLoadingDetail: false,
  message: null,
};

export const entReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.SET_ENT_KHOICV_STATE:
      return {
        ...state,
        ent_khoicv: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_KHOICV_SUCCESS:
      return {
        ...state,
        ent_khoicv: action.payload.ent_khoicv,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_KHOICV_FAIL:
      return {
        ...state,
        ent_khoicv: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_CALV_STATE:
      return {
        ...state,
        ent_calv: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_CALV_SUCCESS:
      return {
        ...state,
        ent_calv: action.payload.ent_calv,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_CALV_FAIL:
      return {
        ...state,
        ent_calv: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_GIAMSAT_STATE:
      return {
        ...state,
        ent_giamsat: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_GIAMSAT_SUCCESS:
      return {
        ...state,
        ent_giamsat: action.payload.ent_giamsat,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_GIAMSAT_FAIL:
      return {
        ...state,
        ent_giamsat: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_KHUVUC_STATE:
      return {
        ...state,
        ent_khuvuc: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_KHUVUC_SUCCESS:
      return {
        ...state,
        ent_khuvuc: action.payload.ent_khuvuc,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_KHUVUC_FAIL:
      return {
        ...state,
        ent_khuvuc: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_TOANHA_STATE:
      return {
        ...state,
        ent_toanha: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_TOANHA_SUCCESS:
      return {
        ...state,
        ent_toanha: action.payload.ent_toanha,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_TOANHA_FAIL:
      return {
        ...state,
        ent_toanha: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_DUAN_STATE:
      return {
        ...state,
        ent_duan: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_DUAN_SUCCESS:
      return {
        ...state,
        ent_duan: action.payload.ent_duan,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_DUAN_FAIL:
      return {
        ...state,
        ent_duan: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_CHUCVU_STATE:
      return {
        ...state,
        ent_chucvu: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_CHUCVU_SUCCESS:
      return {
        ...state,
        ent_chucvu: action.payload.ent_chucvu,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_CHUCVU_FAIL:
      return {
        ...state,
        ent_chucvu: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_CHECKLIST_STATE:
      return {
        ...state,
        ent_checklist: null,
        error: false,
        isLoading: action.payload.isLoading,
        message: null,
      };
    case type.SET_ENT_CHECKLIST_SUCCESS:
      return {
        ...state,
        ent_checklist: action.payload.ent_checklist,
        error: false,
        isLoading: action.payload.isLoading,
        message: null,
      };
    case type.SET_ENT_CHECKLIST_FAIL:
      return {
        ...state,
        ent_checklist: action.payload.ent_checklist,
        error: false,
        isLoading: action.payload.isLoading,
        message: null,
      };
    case type.SET_ENT_TANG_STATE:
      return {
        ...state,
        ent_tang: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_TANG_SUCCESS:
      return {
        ...state,
        ent_tang: action.payload.ent_tang,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_TANG_FAIL:
      return {
        ...state,
        ent_tang: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_USERS_STATE:
      return {
        ...state,
        ent_users: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_USERS_SUCCESS:
      return {
        ...state,
        ent_users: action.payload.ent_users,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_USERS_FAIL:
      return {
        ...state,
        ent_users: null,
        error: false,
        isLoading: true,
        message: null,
      };
      case type.SET_ENT_CHECKLIST_DETAIL_STATE:
        return {
          ...state,
          ent_checklist_detail: action.payload.ent_checklist_detail,
          error: false,
          isLoadingDetail: action.payload.isLoading,
          message: null,
        };
      case type.SET_ENT_CHECKLIST_DETAIL_SUCCESS:
        return {
          ...state,
          ent_checklist_detail: action.payload.ent_checklist_detail,
          error: false,
          isLoadingDetail: action.payload.isLoading,
          message: null,
        };
      case type.SET_ENT_CHECKLIST_DETAIL_FAIL:
        return {
          ...state,
          ent_checklist_detail: action.payload.ent_checklist_detail,
          error: false,
          isLoadingDetail: action.payload.isLoading,
          message: null,
        };
        case type.SET_ENT_HANGMUC_STATE:
          return {
            ...state,
            ent_hangmuc: null,
            error: false,
            isLoading: true,
            message: null,
          };
        case type.SET_ENT_HANGMUC_SUCCESS:
          return {
            ...state,
            ent_hangmuc: action.payload.ent_hangmuc,
            error: false,
            isLoading: false,
            message: null,
          };
        case type.SET_ENT_HANGMUC_FAIL:
          return {
            ...state,
            ent_hangmuc: null,
            error: false,
            isLoading: true,
            message: null,
          };
          
    case type.SET_LOGOUT:
      return {
        ...state,
      };
    default:
      return state;
  }
};
