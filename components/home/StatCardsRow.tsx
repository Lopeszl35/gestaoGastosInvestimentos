import React from "react";
import { ScrollView, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { homeColors } from "@/styles/homeStyles";

type Variant = "success" | "danger" | "info" | "warning";

type Stat = {
  title: string;
  value: number | string;
  delta: number;
  variant: Variant;
};

function formatMoney(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function variantMeta(variant: Variant) {
  if (variant === "success") return { color: homeColors.green, icon: "trending-up" as const };
  if (variant === "danger") return { color: homeColors.red, icon: "trending-down" as const };
  if (variant === "warning") return { color: homeColors.yellow, icon: "show-chart" as const };
  return { color: homeColors.blue, icon: "show-chart" as const };
}

export default function StatCardsRow({ stats }: { stats: Stat[] }) {
  return (
    <View style={{ marginTop: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {stats.map((s, idx) => {
          const meta = variantMeta(s.variant);
          const valueText = typeof s.value === "number" ? formatMoney(s.value) : s.value;

          return (
            <View
              key={idx}
              style={{
                width: 210,
                borderRadius: 18,
                padding: 14,
                backgroundColor: "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: homeColors.text2, fontWeight: "800", fontSize: 12 }}>{s.title}</Text>
                <View style={{
                  width: 36, height: 36, borderRadius: 14,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  alignItems: "center", justifyContent: "center"
                }}>
                  <MaterialIcons name={meta.icon} size={18} color={meta.color} />
                </View>
              </View>

              <Text style={{ color: homeColors.text, fontWeight: "900", fontSize: 22, marginTop: 10 }}>
                {valueText}
              </Text>

              <Text style={{ marginTop: 8, color: meta.color, fontWeight: "900", fontSize: 12 }}>
                +{s.delta.toFixed(1)}%{" "}
                <Text style={{ color: homeColors.text3, fontWeight: "700" }}>vs mês anterior</Text>
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
