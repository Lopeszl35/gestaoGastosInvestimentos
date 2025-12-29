import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { homeStyles, homeColors } from "@/styles/homeStyles";

type Tx = {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: "in" | "out";
};

function money(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function RecentTransactions({
  title,
  subtitle,
  items,
  onPressSeeMore,
}: {
  title: string;
  subtitle: string;
  items: Tx[];
  onPressSeeMore: () => void;
}) {
  return (
    <View style={[homeStyles.card, { marginTop: 12, marginHorizontal: 16 }]}>
      <View style={homeStyles.cardTitleRow}>
        <Text style={homeStyles.cardTitle}>{title}</Text>
        <TouchableOpacity onPress={onPressSeeMore}>
          <Text style={homeStyles.cardSubtitleLink}>{subtitle}</Text>
        </TouchableOpacity>
      </View>

      {items.map((tx) => {
        const isIn = tx.type === "in";
        const color = isIn ? homeColors.green : homeColors.red;
        const icon = isIn ? "trending-up" : "trending-down";

        return (
          <View
            key={tx.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: "rgba(255,255,255,0.06)",
            }}
          >
            <View style={{ flexDirection: "row", gap: 12, alignItems: "center", flex: 1, paddingRight: 10 }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.10)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name={icon} size={18} color={color} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: homeColors.text, fontWeight: "900" }}>{tx.title}</Text>
                <Text style={{ color: homeColors.text3, fontWeight: "700", marginTop: 2 }}>{tx.category}</Text>
              </View>
            </View>

            <Text style={{ color, fontWeight: "900" }}>
              {isIn ? "+" : "-"}
              {money(tx.amount)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
