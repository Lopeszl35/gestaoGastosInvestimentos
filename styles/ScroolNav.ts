import { StyleSheet, Dimensions, Platform } from "react-native";
import { themes } from "@/global/themes";

const { width } = Dimensions.get("window");

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  android: {
    elevation: 4,
  },
});

export const stylesScroolNav = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingLeft: 16,
  },

  item: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#111A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginRight: 10,
    ...shadow,
  },

  itemText: {
    color: "#EAF0FF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: themes.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    ...shadow,
  },
});
