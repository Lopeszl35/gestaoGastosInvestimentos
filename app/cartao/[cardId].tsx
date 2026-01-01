import React, { useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import ProtectedRoute from "@/components/ProtectedRoute";
import { gfStyles, gfColors } from "@/styles/GastosFixosStyles";
import { useCartaoCredito } from "@/hooks/useCartaoCredito";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  const label = date.toLocaleString("pt-BR", { month: "long" });
  return `${label.replace(/^./, (c) => c.toUpperCase())} / ${y}`;
}

const CartaoDetalhes: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ cardId: string }>();
  const cardId = params.cardId || "cartao";

  const {
    months,
    selectedMonth,
    changeMonth,
    totalMes,
    totalPorMes,
    pagedItems,
    page,
    totalPages,
    goNext,
    goPrev,
  } = useCartaoCredito(String(cardId));

  const monthPills = useMemo(() => {
    return months.map((m) => {
      const active = m === selectedMonth;
      const total = totalPorMes.get(m) || 0;

      return (
        <TouchableOpacity
          key={m}
          onPress={() => changeMonth(m)}
          style={[gfStyles.chip, active && gfStyles.chipActive]}
        >
          <Text style={[gfStyles.chipText, active && gfStyles.chipTextActive]}>
            {m.split("-")[1]}/{m.split("-")[0].slice(2)} • {formatBRL(total)}
          </Text>
        </TouchableOpacity>
      );
    });
  }, [months, selectedMonth, changeMonth, totalPorMes]);

  return (
    <View style={gfStyles.container}>
      <FlatList
        data={pagedItems}
        keyExtractor={(it) => it.id}
        contentContainerStyle={gfStyles.content}
        ItemSeparatorComponent={() => <View style={gfStyles.listGap} />}
        ListHeaderComponent={
          <>
            <View style={gfStyles.headerCard}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{ padding: 6 }}
                >
                  <MaterialIcons
                    name="arrow-back"
                    size={22}
                    color={gfColors.text}
                  />
                </TouchableOpacity>

                <Text style={[gfStyles.headerTitle, { fontSize: 18 }]}>
                  Cartão
                </Text>

                <TouchableOpacity
                  onPress={() => alert("Em breve: configurações do cartão")}
                  style={{ padding: 6 }}
                >
                  <MaterialIcons
                    name="settings"
                    size={22}
                    color={gfColors.text}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[gfStyles.headerSub, { marginTop: 10 }]}>
                {monthLabel(selectedMonth)} • Total do mês:{" "}
                {formatBRL(totalMes)}
              </Text>

              <View style={{ marginTop: 14 }}>
                <Text style={[gfStyles.sectionTitle, { fontSize: 14 }]}>
                  Meses
                </Text>
                <View style={{ marginTop: 10, gap: 10 }}>
                  <View style={gfStyles.chipsRow}>
                    {monthPills.slice(0, 2)}
                  </View>
                  <View style={gfStyles.chipsRow}>
                    {monthPills.slice(2, 4)}
                  </View>
                  <View style={gfStyles.chipsRow}>
                    {monthPills.slice(4, 6)}
                  </View>
                  <View style={gfStyles.chipsRow}>
                    {monthPills.slice(6, 8)}
                  </View>
                </View>
              </View>
            </View>

            <View style={gfStyles.sectionHeaderRow}>
              <Text style={gfStyles.sectionTitle}>Parcelas e gastos</Text>
              <TouchableOpacity
                onPress={() => alert("Em breve: adicionar compra no cartão")}
              >
                <Text style={gfStyles.sectionAction}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: gfColors.text2, fontWeight: "700" }}>
                Página {page} de {totalPages}
              </Text>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={goPrev}
                  disabled={page <= 1}
                  style={[gfStyles.chip, page <= 1 && { opacity: 0.5 }]}
                >
                  <Text style={gfStyles.chipText}>Anterior</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={goNext}
                  disabled={page >= totalPages}
                  style={[
                    gfStyles.chip,
                    page >= totalPages && { opacity: 0.5 },
                  ]}
                >
                  <Text style={gfStyles.chipText}>Próxima</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={gfStyles.card}>
            <View style={gfStyles.cardRow}>
              <Text style={gfStyles.cardTitle}>{item.title}</Text>
              <View style={gfStyles.pill}>
                <Text style={gfStyles.pillText}>
                  {formatBRL(item.valorParcela)}
                </Text>
              </View>
            </View>

            <Text style={gfStyles.cardSub}>
              {item.subtitle} • Restam {item.parcelasRestantes}/
              {item.parcelasTotal}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default CartaoDetalhes;
