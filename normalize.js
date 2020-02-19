import { Dimensions, PixelRatio } from "react-native";

// import getDimensions from '../functions/getDimensions';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const IS_TABLET = SCREEN_WIDTH > 600;
const constant = SCREEN_WIDTH > 1000 ? 720 : IS_TABLET ? 500 : 300;
const scale = SCREEN_WIDTH / constant;

export function normalize(size) {
  const newSize = size * scale;
  // if (Platform.OS === 'ios') {
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
  // } else {
  //   return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  // }
}
