import React, { useEffect, useState, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import OnBoardingScreen from "../screens/OnBoardingScreen";

const Stack = createNativeStackNavigator();

const DefaultNavigation = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="OnBoardingScreen">
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoginScreen"
          component={LoginScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default DefaultNavigation;
