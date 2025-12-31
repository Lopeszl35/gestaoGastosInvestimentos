import { StyleSheet, Platform } from "react-native";

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  android: { elevation: 5 },
});

export const gvStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },

  content: { padding: 16, paddingBottom: 110 },

  headerCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#111A2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    ...shadow,
  },

  headerTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: "#EAF0FF", fontSize: 18, fontWeight: "900" },
  headerSub: { color: "rgba(234,240,255,0.70)", marginTop: 2, fontSize: 12 },

  headerNumbersRow: { flexDirection: "row", gap: 14, marginTop: 14 },
  metricBox: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  metricLabel: { color: "rgba(234,240,255,0.70)", fontSize: 12 },
  metricValue: { color: "#EAF0FF", fontSize: 16, fontWeight: "900", marginTop: 6 },

  progressWrap: { marginTop: 14 },
  progressBarBg: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#2BE080",
  },
  alertText: { marginTop: 10, color: "#FF6B6B", fontWeight: "800", fontSize: 12 },

  sectionHeaderRow: { marginTop: 18, marginBottom: 10, flexDirection: "row", justifyContent: "space-between" },
  sectionTitle: { color: "#EAF0FF", fontSize: 16, fontWeight: "900" },
  sectionAction: { color: "#2BE080", fontSize: 12, fontWeight: "800" },

  card: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#0F1830",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
    ...shadow,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { color: "#EAF0FF", fontSize: 14, fontWeight: "900" },
  cardSub: { color: "rgba(234,240,255,0.70)", marginTop: 6, fontSize: 12 },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(43,224,128,0.14)",
    borderWidth: 1,
    borderColor: "rgba(43,224,128,0.30)",
  },
  pillText: { color: "#2BE080", fontSize: 12, fontWeight: "900" },

  fab: {
    position: "absolute",
    right: 16,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#2BE080",
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },

  emptyBox: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  emptyText: { color: "rgba(234,240,255,0.75)", fontSize: 13 },
});
