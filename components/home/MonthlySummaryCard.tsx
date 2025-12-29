import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { homeStyles, homeColors } from "@/styles/homeStyles";

function money(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function MonthlySummaryCard({
  monthLabel,
  saldoMes,
  receitas,
  despesas,
  usoOrcamentoPercent,
}: {
  monthLabel: string;
  saldoMes: number;
  receitas: number;
  despesas: number;
  usoOrcamentoPercent: number;
}) {
  const receitasW = useMemo(() => Math.min(100, Math.max(0, (receitas / (receitas + despesas + 1)) * 100)), [receitas, despesas]);
  const despesasW = useMemo(() => Math.min(100, Math.max(0, (despesas / (receitas + despesas + 1)) * 100)), [receitas, despesas]);

  return (
    <View style={homeStyles.card}>
      <View style={homeStyles.cardTitleRow}>
        <Text style={homeStyles.cardTitle}>Resumo Mensal</Text>
        <Text style={homeStyles.cardSubtitleLink}>{monthLabel}</Text>
      </View>

      <View style={{
        borderRadius: 18,
        padding: 14,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
      }}>
        <Text style={{ color: homeColors.text3, fontWeight: "800" }}>Saldo do Mês</Text>
        <Text style={{ color: homeColors.green, fontWeight: "900", fontSize: 26, marginTop: 6 }}>
          {money(saldoMes)}
        </Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text style={{ color: homeColors.text3, fontWeight: "800", marginBottom: 6 }}>Receitas</Text>
        <View style={{ height: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)" }}>
          <View style={{ width: `${receitasW}%`, height: 10, borderRadius: 999, backgroundColor: homeColors.green }} />
        </View>
        <Text style={{ color: homeColors.green, fontWeight: "900", marginTop: 6 }}>{money(receitas)}</Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text style={{ color: homeColors.text3, fontWeight: "800", marginBottom: 6 }}>Despesas</Text>
        <View style={{ height: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)" }}>
          <View style={{ width: `${despesasW}%`, height: 10, borderRadius: 999, backgroundColor: homeColors.red }} />
        </View>
        <Text style={{ color: homeColors.red, fontWeight: "900", marginTop: 6 }}>{money(despesas)}</Text>
      </View>

      <View style={{
        marginTop: 14,
        borderRadius: 16,
        padding: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Text style={{ color: homeColors.text2, fontWeight: "800" }}>Uso do orçamento</Text>
        <Text style={{ color: homeColors.blue, fontWeight: "900" }}>{usoOrcamentoPercent}%</Text>
      </View>
    </View>
  );
}
