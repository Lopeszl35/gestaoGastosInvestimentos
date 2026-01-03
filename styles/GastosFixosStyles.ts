import { StyleSheet, Platform } from "react-native";

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  android: { elevation: 10 },
});

export const gfColors = {
  bg: "#0B1220",
  card: "rgba(255,255,255,0.06)",
  card2: "rgba(255,255,255,0.08)",
  stroke: "rgba(255,255,255,0.10)",
  text: "#EAF0FF",
  text2: "rgba(234,240,255,0.72)",
  text3: "rgba(234,240,255,0.55)",
  green: "#22C55E",
  red: "#F87171",
  blue: "#38BDF8",
  yellow: "#FBBF24",
};

export const gfStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gfColors.bg,
  },
  content: {
    padding: 16,
    // Espaço extra pra não ficar "grudado" com FAB e barra de navegação
    paddingBottom: 140,
  },

  // --- Shared "detail" helpers (Cartão / Financiamento) ---
  headerNumbersRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 12,
  },
  metricBox: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  metricLabel: {
    color: gfColors.text3,
    fontWeight: "800",
    fontSize: 11,
  },
  metricValue: {
    marginTop: 6,
    color: gfColors.text,
    fontWeight: "900",
    fontSize: 14,
  },

  paginationRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  pageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  pageBtnDisabled: {
    opacity: 0.45,
  },
  pageBtnText: {
    color: gfColors.text,
    fontWeight: "900",
    fontSize: 12,
  },
  pageLabel: {
    color: gfColors.text2,
    fontWeight: "800",
    fontSize: 12,
  },

  headerCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: gfColors.card,
    borderWidth: 1,
    borderColor: gfColors.stroke,
    ...shadow,
  },
  headerTitle: {
    color: gfColors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  headerSub: {
    marginTop: 6,
    color: gfColors.text2,
    fontSize: 13,
    lineHeight: 18,
  },

  sectionHeaderRow: {
    marginTop: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: gfColors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  sectionAction: {
    color: gfColors.green,
    fontWeight: "900",
  },

  chipsRow: {
    flexDirection: "row",
    gap: 10,
  },

  // --- Tabela/Seletor mensal horizontal (Cartões) ---
  monthRow: {
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 8,
  },
  monthCell: {
    minWidth: 108,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginRight: 12,
  },
  monthCellActive: {
    backgroundColor: "rgba(56,189,248,0.16)",
    borderColor: "rgba(56,189,248,0.35)",
  },
  monthCellLabel: {
    color: gfColors.text3,
    fontWeight: "900",
    fontSize: 11,
    textTransform: "capitalize",
  },
  monthCellValue: {
    marginTop: 6,
    color: gfColors.text,
    fontWeight: "900",
    fontSize: 13,
  },
  monthCellMeta: {
    marginTop: 4,
    color: gfColors.text2,
    fontWeight: "800",
    fontSize: 11,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  chipActive: {
    backgroundColor: "rgba(34,197,94,0.16)",
    borderColor: "rgba(34,197,94,0.30)",
  },
  chipText: {
    color: gfColors.text2,
    fontWeight: "800",
    fontSize: 12,
  },
  chipTextActive: {
    color: gfColors.text,
  },

  // Mais respiro visual entre os blocos (evita sensação de "apertado")
  listGap: { height: 18 },

  card: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: gfColors.card2,
    borderWidth: 1,
    borderColor: gfColors.stroke,
    ...shadow,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    color: gfColors.text,
    fontWeight: "900",
    fontSize: 15,
  },
  cardSub: {
    marginTop: 6,
    color: gfColors.text2,
    fontSize: 12,
    lineHeight: 16,
  },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(56,189,248,0.16)",
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.30)",
  },
  pillText: {
    color: gfColors.text,
    fontWeight: "900",
    fontSize: 12,
  },

  progressBarBg: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: gfColors.green,
  },

  emptyBox: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  emptyText: {
    color: gfColors.text2,
    fontWeight: "700",
    lineHeight: 18,
  },

  // Floating Action Button (para futuros cadastros)
  fab: {
    position: "absolute",
    right: 18,
    bottom: 22,
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: gfColors.blue,
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.35)",
    ...shadow,
  },
});
