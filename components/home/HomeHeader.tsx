import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { homeColors } from "@/styles/homeStyles";

type Props = {
  firstName: string;
  perfil: string;
  saldoLabel: string;
  saldoValue: string;
  onSearchPress: () => void;
  onBellPress: () => void;
};

export default function HomeHeader({
  firstName,
  perfil,
  saldoLabel,
  saldoValue,
  onSearchPress,
  onBellPress,
}: Props) {
  return (
    <LinearGradient
      colors={["#0B1220", "#0C1730", "#0B1220"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: 18,
        paddingHorizontal: 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.06)",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View>
          <Text style={{ color: homeColors.text, fontSize: 18, fontWeight: "900" }}>
            Dashboard
          </Text>
          <Text style={{ color: homeColors.text3, marginTop: 2 }}>
            Bem-vindo de volta{firstName ? `, ${firstName}` : ""}. Aqui está seu resumo financeiro.
          </Text>
        </View>
      </View>

      <View style={{
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}>
        <TouchableOpacity
          onPress={onSearchPress}
          style={{
            flex: 1,
            height: 42,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            gap: 10,
          }}
        >
          <MaterialIcons name="search" size={18} color={homeColors.text3} />
          <Text style={{ color: homeColors.text3, fontWeight: "700" }}>Buscar...</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onBellPress}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcons name="notifications-none" size={20} color={homeColors.text} />
        </TouchableOpacity>
      </View>

      <View style={{
        marginTop: 14,
        borderRadius: 18,
        padding: 14,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.10)",
      }}>
        <Text style={{ color: homeColors.text3, fontWeight: "800", fontSize: 12 }}>
          {saldoLabel}
        </Text>
        <Text style={{ color: homeColors.text, fontWeight: "900", fontSize: 28, marginTop: 6 }}>
          {saldoValue}
        </Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 6,
            paddingVertical: 8, paddingHorizontal: 10,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.10)"
          }}>
            <MaterialIcons name="account-circle" size={16} color={homeColors.text2} />
            <Text style={{ color: homeColors.text2, fontWeight: "800", fontSize: 12 }}>{perfil}</Text>
          </View>

          <View style={{
            flexDirection: "row", alignItems: "center", gap: 6,
            paddingVertical: 8, paddingHorizontal: 10,
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.06)",
            borderWidth: 1, borderColor: "rgba(255,255,255,0.10)"
          }}>
            <MaterialIcons name="calendar-today" size={16} color={homeColors.text2} />
            <Text style={{ color: homeColors.text2, fontWeight: "800", fontSize: 12 }}>Este mês</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
