import React, { useContext, useEffect } from "react";
import TabNavigation from "./TabNavigation";
import DefaultNavigation from "./DefaultNavigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import ScanContext from "../context/ScanContext";

export default function CheckNavigation() {
  const { authTokenAsset, userAsset, authTokenChecklist, userChecklist } =
    useSelector((state) => state.authReducer);

  return (
    <>
      {userAsset === null && userChecklist === null ? (
        <DefaultNavigation />
      ) : (
        <TabNavigation />
      )}
    </>
  );
}
