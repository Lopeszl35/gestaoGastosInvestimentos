import React, { useMemo } from "react";
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import ProtectedRoute from "@/components/ProtectedRoute";
import { gfStyles, gfColors } from "@/styles/GastosFixosStyles";
import { useGastosFixos, FixedExpenseType, CreditCard, FixedBill } from "@/hooks/useGastosFixos";

const typeLabel: Record<FixedExpenseType, string> = {
  cartao: "Cartão de crédito",
  financiamento: "Financiamento",
  contas: "Contas",
  outros: "Outros",
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const GastosFixos: React.FC = () => {
  const router = useRouter();
  const {
    selectedType,
    setSelectedType,
    creditCards,
    filteredBills,
    refreshing,
    refresh,
  } = useGastosFixos();

  const headerSubtitle = useMemo(() => {
    if (selectedType === "cartao") {
      return "Cadastre seus cartões e acompanhe parcelas, recorrências e totais por mês.";
    }
    return "Organize seus gastos recorrentes: contas, financiamentos e assinaturas.";
  }, [selectedType]);

  const renderTypeChip = (t: FixedExpenseType, icon: any) => {
    const active = selectedType === t;
    return (
      <TouchableOpacity
        key={t}
        onPress={() => setSelectedType(t)}
        style={[gfStyles.chip, active && gfStyles.chipActive]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialIcons name={icon} size={18} color={active ? gfColors.text : gfColors.text2} />
          <Text style={[gfStyles.chipText, active && gfStyles.chipTextActive]}>
            {typeLabel[t]}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCard = ({ item }: { item: CreditCard }) => {
    const pct = item.limite > 0 ? Math.min(item.gastoMesAtual / item.limite, 1) : 0;
    return (
      <TouchableOpacity
        style={gfStyles.card}
        onPress={() => router.push({ pathname: "/cartao/[cardId]", params: { cardId: item.id } } as any)}
      >
        <View style={gfStyles.cardRow}>
          <Text style={gfStyles.cardTitle}>{item.nome}</Text>
          <View style={gfStyles.pill}>
            <Text style={gfStyles.pillText}>{formatBRL(item.gastoMesAtual)}</Text>
          </View>
        </View>

        <Text style={gfStyles.cardSub}>
          {item.bandeira ? `${item.bandeira} • ` : ""}Fechamento dia {item.fechamentoDia} • Vencimento dia {item.vencimentoDia}
        </Text>

        <View style={{ marginTop: 10 }}>
          <View style={gfStyles.progressBarBg}>
            <View style={[gfStyles.progressBarFill, { width: `${pct * 100}%` }]} />
          </View>
          <Text style={[gfStyles.cardSub, { marginTop: 8 }]}>
            Limite: {formatBRL(item.limite)} • Uso: {Math.round(pct * 100)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBill = ({ item }: { item: FixedBill }) => (
    <View style={gfStyles.card}>
      <View style={gfStyles.cardRow}>
        <Text style={gfStyles.cardTitle}>{item.titulo}</Text>
        <View style={gfStyles.pill}>
          <Text style={gfStyles.pillText}>{formatBRL(item.valorMensal)}</Text>
        </View>
      </View>
      <Text style={gfStyles.cardSub}>{item.descricao} • Vence dia {item.vencimentoDia}</Text>
    </View>
  );

  const data = selectedType === "cartao" ? creditCards : filteredBills;

  return (
    <ProtectedRoute>
      <View style={gfStyles.container}>
        <FlatList
          data={data as any[]}
          keyExtractor={(item: any) => String(item.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={gfColors.text} />}
          contentContainerStyle={gfStyles.content}
          ItemSeparatorComponent={() => <View style={gfStyles.listGap} />}
          ListHeaderComponent={
            <>
              <View style={gfStyles.headerCard}>
                <Text style={gfStyles.headerTitle}>Gastos Fixos</Text>
                <Text style={gfStyles.headerSub}>{headerSubtitle}</Text>

                <View style={{ marginTop: 14 }}>
                  <Text style={[gfStyles.sectionTitle, { fontSize: 14 }]}>Tipo</Text>
                  <View style={{ marginTop: 10 }}>
                    <View style={gfStyles.chipsRow}>
                      {renderTypeChip("cartao", "credit-card")}
                      {renderTypeChip("contas", "receipt-long")}
                    </View>
                    <View style={{ height: 10 }} />
                    <View style={gfStyles.chipsRow}>
                      {renderTypeChip("financiamento", "payments")}
                      {renderTypeChip("outros", "more-horiz")}
                    </View>
                  </View>
                </View>
              </View>

              <View style={gfStyles.sectionHeaderRow}>
                <Text style={gfStyles.sectionTitle}>
                  {selectedType === "cartao" ? "Seus cartões" : "Seus gastos fixos"}
                </Text>
                <TouchableOpacity onPress={() => alert("Em breve: adicionar gasto fixo / cartão")}>
                  <Text style={gfStyles.sectionAction}>+ Adicionar</Text>
                </TouchableOpacity>
              </View>

              {data.length === 0 && (
                <View style={gfStyles.emptyBox}>
                  <Text style={gfStyles.emptyText}>
                    {selectedType === "cartao"
                      ? "Nenhum cartão cadastrado ainda. Toque em “Adicionar” para cadastrar seu primeiro cartão."
                      : "Nenhum gasto fixo encontrado para este tipo. Toque em “Adicionar” para cadastrar um gasto fixo."}
                  </Text>
                </View>
              )}
            </>
          }
          renderItem={selectedType === "cartao" ? (renderCard as any) : (renderBill as any)}
        />
      </View>
    </ProtectedRoute>
  );
};

export default GastosFixos;
