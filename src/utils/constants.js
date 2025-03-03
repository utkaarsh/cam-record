import { Dimensions } from "react-native";

export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;
export const row = windowWidth - 45;
export const col1 = row / 12;
export const col2 = col1 * 2;
export const col3 = col1 * 3;
export const col4 = col1 * 4;
export const col5 = col1 * 5;
export const col6 = row / 2;
export const col7 = col6 + col1;
export const col8 = col7 + col1;
export const col9 = col8 + col1;
export const col10 = col9 + col1;
export const col11 = col10 + col1;
export const col12 = windowWidth - 40;
