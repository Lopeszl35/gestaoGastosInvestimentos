import { StyleSheet, Platform, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  android: { elevation: 12 },
});

const colors = {
  bg: "#0B1220",
  glass: "rgba(255,255,255,0.06)",
  glass2: "rgba(255,255,255,0.08)",
  stroke: "rgba(255,255,255,0.10)",
  text: "#EAF0FF",
  text2: "rgba(234,240,255,0.72)",
  text3: "rgba(234,240,255,0.55)",
  red: "#F87171",
};

export const styleNavBar = StyleSheet.create({
  // Top bar
  navBar: {
    width,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.stroke,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitleWrap: {
    flex: 1,
  },
  navTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  navSubtitle: {
    marginTop: 2,
    color: colors.text3,
    fontSize: 12,
    fontWeight: "700",
  },
  profilePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.stroke,
    maxWidth: 170,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "rgba(56,189,248,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 12,
  },
  profileName: {
    color: colors.text2,
    fontWeight: "800",
    fontSize: 12,
    flexShrink: 1,
  },

  // Overlay
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height,
    width,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 10,
  },

  // Side menu
  sideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: colors.bg,
    zIndex: 11,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.06)",
    ...shadow,
  },

  sideHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  sideHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sideAvatar: {
    width: 42,
    height: 42,
    borderRadius: 18,
    backgroundColor: "rgba(34,197,94,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  sideAvatarText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 14,
  },
  sideName: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 14,
  },
  sideEmail: {
    marginTop: 2,
    color: colors.text3,
    fontWeight: "700",
    fontSize: 12,
  },

  sectionLabel: {
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
    color: colors.text3,
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 0.8,
  },

  // Menu items
  menuItem: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.stroke,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuItemActive: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.22)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuText: {
    color: colors.text2,
    fontSize: 14,
    fontWeight: "800",
  },
  menuTextActive: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },

  // Submenu
  subMenu: {
    paddingLeft: 24,
    paddingRight: 16,
    marginBottom: 6,
    gap: 10,
  },
  subMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  subMenuText: {
    color: colors.text3,
    fontSize: 13,
    fontWeight: "800",
  },

  // Danger item
  menuItemDanger: {
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(248,113,113,0.10)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.25)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuTextDanger: {
    color: colors.red,
    fontSize: 14,
    fontWeight: "900",
  },

  footer: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  footerText: {
    color: "rgba(234,240,255,0.35)",
    fontWeight: "800",
    fontSize: 11,
  },
});
