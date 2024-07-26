import * as type from "../types";
const initialState = {
  tb_checklistc: null,
  tb_checklistchitiet: null,
  error: false,
  isLoading: false,
  message: null,
};

export const tbReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.SET_TB_CHECKLISTC_STATE:
      return {
        ...state,
        tb_checklistc: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_TB_CHECKLISTC_SUCCESS:
      return {
        ...state,
        tb_checklistc: action.payload.tb_checklistc,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_TB_CHECKLISTC_FAIL:
      return {
        ...state,
        tb_checklistc: null,
        error: false,
        isLoading: true,
        message: null,
      };

    default:
      return state;
  }
};
