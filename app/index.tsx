import { Layout } from "@/theme/layout";
import { View } from "react-native";
import StartScreen from "./start";
export default function Index() {
  
  return (
    <View
      style={Layout.screen}
    >
      {/* <Text>Edit app/index.tsx to edit this screen.</Text> */}
      <StartScreen/>
    </View>
  );
}
