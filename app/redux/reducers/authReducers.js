import * as type from "../types";
const initialState = {
  authTokenChecklist: null,
  userChecklist: null,
  errorChecklist: false,
  isLoadingChecklist: false,
  messageChecklist: null,

  authTokenAsset: null,
  userAsset: null,
  errorAsset: false,
  isLoadingAsset: false,
  messageAsset: null,
};

export const authReducer = (state = initialState, action) => {
  // console.log('action', action.)
  switch (action.type) {
    case type.ASSET_SET_LOGIN_INIT:
      return {
        ...state,
        authTokenAsset: null,
        userAsset: null,
        errorAsset: false,
        isLoadingAsset: action.payload.isLoadingAsset,
        messageAsset: action.payload.messageAsset,
      };
    case type.CHECKLIST_SET_LOGIN_INIT:
      return {
        ...state,
        authTokenChecklist: null,
        userChecklist: null,
        errorChecklist: false,
        isLoadingChecklist: action.payload.isLoadingChecklist,
        messageChecklist: action.payload.messageChecklist,
      };
    case type.CHECKLIST_SET_LOGIN_SUCCESS:
      return {
        ...state,
        authTokenChecklist: action.payload.authTokenChecklist,
        isLoadingChecklist: action.payload.isLoadingChecklist,
        userChecklist: action.payload.userChecklist,

        errorChecklist: false,
        messageChecklist: null,
      };
    case type.ASSET_SET_LOGIN_SUCCESS:
      return {
        ...state,

        userAsset: action.payload.userAsset,
        authTokenAsset: action.payload.authTokenAsset,
        isLoadingAsset: action.payload.isLoadingAsset,

        errorAsset: false,
        messageAsset: null,
      };
    case type.CHECKLIST_SET_LOGIN_FAIL:
      return {
        ...state,
        authTokenChecklist: null,
        userChecklist: null,
        errorChecklist: true,
        isLoadingChecklist: action.payload.isLoadingChecklist,
        messageChecklist: action.payload.messageChecklist,
      };
    case type.ASSET_SET_LOGIN_FAIL:
      return {
        ...state,

        authTokenAsset: null,
        userAsset: null,
        errorAsset: true,
        isLoadingAsset: action.payload.isLoadingAsset,
        messageAsset: action.payload.messageAsset,
      };
    case type.SET_LOGOUT:
      return {
        ...state,
        authTokenChecklist: null,
        userChecklist: null,
        errorChecklist: false,
        isLoadingChecklist: false,
        messageChecklist: null,

        authTokenAsset: null,
        userAsset: null,
        errorAsset: false,
        isLoadingAsset: false,
        messageAsset: null,
      };
    default:
      return state;
  }
};
