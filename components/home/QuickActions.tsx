import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { homeStyles, homeColors } from "@/styles/homeStyles";

type Variant = "success" | "danger" | "info" | "warning";

type Action = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  variant: Variant;
  onPress: () => void;
};

function variantColor(v: Variant) {
  if (v === "success") return homeColors.green;
  if (v === "danger") return homeColors.red;
  if (v === "warning") return homeColors.yellow;
  return homeColors.blue;
}

export default function QuickActions({ actions }: { actions: Action[] }) {
  return (
    <View style={[homeStyles.card, { padding: 14 }]}>
      <Text style={{ color: homeColors.text, fontWeight: "900", fontSize: 16, marginBottom: 10 }}>
        Ações Rápidas
      </Text>

      <View style={homeStyles.quickActionsGrid}>
        {actions.map((a) => {
          const c = variantColor(a.variant);

          return (
            <TouchableOpacity
              key={a.id}
              activeOpacity={0.9}
              onPress={async () => {
                await Haptics.selectionAsync();
                a.onPress();
              }}
              style={homeStyles.quickAction}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <MaterialIcons name={a.icon} size={20} color={c} />
              </View>

              <Text style={{ color: homeColors.text, fontWeight: "900", fontSize: 14 }}>
                {a.title}
              </Text>

              <Text style={{ color: homeColors.text3, fontWeight: "700", marginTop: 2 }}>
                {a.subtitle}
              </Text>
            </TouchableOpacity>
          );
              })}
            </View>
    </View>
  );
}
