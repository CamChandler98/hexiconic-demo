import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Hexiconic",
  slug: "word-app",
  experiments: {
    baseUrl: "/hexiconic-demo",
    typedRoutes: true,
    reactCompiler: true,
  },

  // ✅ Marketing version (user-facing)
  version: "1.0.0",

  orientation: "portrait",

  icon: "./assets/graphics/heciconic-icon.png",
  scheme: "wordapp",
  userInterfaceStyle: "automatic",

  newArchEnabled: true,

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.astrophysician.hexiconic",

    // ✅ iOS build number (must increment every upload)
    buildNumber: "1",
  },

  android: {
    package: "com.astrophysician.hexiconic",

    versionCode: 1,

    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,

    blockedPermissions: [
      "android.permission.RECORD_AUDIO",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_MEDIA_IMAGES",
      "android.permission.READ_MEDIA_VIDEO",
      "android.permission.READ_MEDIA_AUDIO",
    ],

    adaptiveIcon: {
      backgroundColor: "#f7fafd",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
  },

  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",

    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],

    "expo-font",

    [
      "react-native-google-mobile-ads",
      {
        androidAppId: "ca-app-pub-5172012935287238~4485781087",
        iosAppId: "ca-app-pub-5172012935287238~4485781087",
      },
    ],
  ],

  extra: {
    router: {},
    eas: {
      projectId: "a221bea1-0fc6-4f4f-b1ac-3f9f75dc03df",
    },
  },
};

export default config;
