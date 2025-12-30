import { Dimensions, Platform, StyleSheet } from "react-native";
import { themes } from "../global/themes";

const { width } = Dimensions.get("window");

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  android: {
    elevation: 6,
  },
});

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.colors.background,
  },

  keyboard: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  // Decor
  bgCircleOne: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: "rgba(40, 167, 69, 0.10)",
    top: -140,
    left: -140,
  },
  bgCircleTwo: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 380,
    backgroundColor: "rgba(40, 167, 69, 0.08)",
    bottom: -210,
    right: -210,
  },

  // Hero
  hero: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoWrap: {
    width: 92,
    height: 92,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  logo: {
    width: 70,
    height: 70,
  },
  heroTitle: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "900",
    color: themes.colors.text,
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: themes.colors.gray,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 18,
  },

  // Card
  card: {
    alignSelf: "center",
    width: Math.min(width - 32, 420),
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    ...shadow,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: themes.colors.text,
    marginBottom: 10,
  },

  // Error banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(220, 53, 69, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(220, 53, 69, 0.20)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  errorBannerText: {
    flex: 1,
    color: "#7A1B1B",
    fontWeight: "800",
    fontSize: 12,
    lineHeight: 16,
  },

  iconButton: {
    paddingLeft: 8,
    paddingVertical: 6,
  },

  // Button
  button: {
    marginTop: 8,
    backgroundColor: themes.colors.primary,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    fontSize: 15,
    color: themes.colors.white,
    fontWeight: "900",
  },
  buttonLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Bottom row
  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  bottomText: {
    fontSize: 13,
    color: themes.colors.gray,
  },
  bottomLink: {
    fontSize: 13,
    color: themes.colors.primary,
    fontWeight: "900",
  },
});
