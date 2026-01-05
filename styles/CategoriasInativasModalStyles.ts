import { StyleSheet, Platform } from "react-native";

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  android: { elevation: 10 },
});

export const categoriasInativasModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 16,
    justifyContent: "center",
  },

  card: {
    borderRadius: 18,
    backgroundColor: "#0F1A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 14,
    maxHeight: "82%",
    ...shadow,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  title: {
    color: "#EAF0FF",
    fontWeight: "900",
    fontSize: 16,
  },

  stateBox: {
    paddingVertical: 18,
    alignItems: "center",
    gap: 10,
  },

  stateText: {
    color: "rgba(234,240,255,0.70)",
    fontWeight: "800",
  },

  errorText: {
    color: "#F87171",
    fontWeight: "900",
    textAlign: "center",
  },

  retryBtn: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#2BE080",
  },

  retryText: {
    color: "#0B1220",
    fontWeight: "900",
  },

  listContent: {
    paddingTop: 12,
    paddingBottom: 6,
    gap: 10,
  },

  itemCard: {
    borderRadius: 16,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  itemLeft: { flex: 1 },

  itemName: {
    color: "#EAF0FF",
    fontWeight: "900",
  },

  itemSub: {
    marginTop: 4,
    color: "rgba(234,240,255,0.65)",
    fontSize: 12,
    fontWeight: "800",
  },

  reactivateBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#2BE080",
    minWidth: 92,
    alignItems: "center",
    justifyContent: "center",
  },

  reactivateBtnDisabled: {
    opacity: 0.6,
  },

  reactivateText: {
    color: "#0B1220",
    fontWeight: "900",
  },
});
