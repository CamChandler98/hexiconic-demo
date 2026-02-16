// import { FoundWordsButton } from "@/app/components/GameInterface/FoundWordsButton";
// import { FoundWordsModal } from "@/app/components/GameInterface/FoundWordsList";
// import { ScreenHeader } from "@/app/components/General/ScreenHeader";
// import { AppText } from "@/app/components/General/ui/AppText";
// import { Colors } from "@/theme/colors";
// import { Layout } from "@/theme/layout";
// import { useMemo, useState } from "react";
// import { View } from "react-native";

// const DEBUG_FOUND_WORDS = [
//   "planet",
//   "planted",
//   "petal",
//   "panel",
//   "plate",
//   "leapt",
//   "leant",
//   "aptly",
//   "neatly",
//   "latent",
//   "tenant",
//   "talent",
//   "palate",
//   "petalant",
//   "antler",
//   "learn",
//   "rental",
//   "lantern",
//   "eternal",
//   "paternal",
//   "related",
//   "dealer",
//   "leader",
//   "pleat",
//   "plateau",
//   "teal",
//   "late",
//   "tale",
//   "lean",
//   "lane",
//   "panelled",
//   "entrap",
//   "parent",
//   "learned",
//   "relate",
//   "alert",
//   "alter",
//   "later",
//   "rattle",
//   "atelier",
// ];

// export default function FoundWordsDebugScreen() {
//   const [showFoundWordsModal, setShowFoundWordsModal] = useState(true);

//   const wordScores = useMemo<Record<string, number>>(() => {
//     const scores: Record<string, number> = {};

//     for (const word of DEBUG_FOUND_WORDS) {
//       // Keep this simple: approximate score by length for quick UI testing.
//       scores[word] = Math.max(1, word.length);
//     }

//     return scores;
//   }, []);

//   return (
//     <View style={Layout.screen}>
//       <ScreenHeader />

//       <View
//         style={{
//           flex: 1,
//           alignItems: "center",
//           justifyContent: "center",
//           paddingHorizontal: 20,
//           gap: 16,
//         }}
//       >
//         <AppText
//           variant="cardTitle"
//           style={{ color: Colors.text.primary, textAlign: "center" }}
//         >
//           Found Words Modal Debug
//         </AppText>

//         <AppText
//           variant="bodySmall"
//           style={{ color: Colors.text.secondary, textAlign: "center" }}
//         >
//           Open the modal and verify scrolling with 40 words.
//         </AppText>

//         <FoundWordsButton
//           found={DEBUG_FOUND_WORDS.length}
//           total={DEBUG_FOUND_WORDS.length}
//           onPress={() => setShowFoundWordsModal(true)}
//           color={Colors.interactive.primaryMuted}
//         />
//       </View>

//       <FoundWordsModal
//         visible={showFoundWordsModal}
//         onClose={() => setShowFoundWordsModal(false)}
//         words={DEBUG_FOUND_WORDS}
//         wordScores={wordScores}
//       />
//     </View>
//   );
// }
