import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

import { CartoesStyles as s } from "@/styles/CartoesStyles";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";
import { useCartoesScreen } from "@/hooks/cartoes/useCartoesScreen";

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Cartoes() {
  const {
    loading,
    error,
    cards,
    selectedId,
    setSelectedId,
    selected,
    expenses,
    categories,
    activeInstallments,
    totalMes,
  } = useCartoesScreen();

  const [openNewCard, setOpenNewCard] = useState(false);
  const [openNewExpense, setOpenNewExpense] = useState(false);

  const limitDisp = useMemo(() => {
    if (!selected) return 0;
    return Math.max(0, selected.limiteTotal - selected.limiteUsado);
  }, [selected]);

  const percent = useMemo(() => {
    if (!selected) return 0;
    return Math.min(
      100,
      Math.round((selected.limiteUsado / selected.limiteTotal) * 100)
    );
  }, [selected]);

  return (
    <View style={s.screen}>
      <ScrollView
        style={s.container}
        contentContainerStyle={{ paddingBottom: 26 }}
      >
        {/* HEADER igual imagem */}
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Text style={s.h1}>Cartões de Crédito</Text>
            <Text style={s.h2}>
              Gerencie seus cartões e acompanhe seus gastos
            </Text>
          </View>

          <View style={s.headerRight}>
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="rgba(234,240,255,0.35)"
              style={s.search}
            />
            <View style={s.topActionsRow}>
              <Pressable
                style={s.btnGhost}
                onPress={() => setOpenNewExpense(true)}
              >
                <Text style={s.btnGhostText}>+ Novo Gasto</Text>
              </Pressable>
              <Pressable
                style={s.btnPrimary}
                onPress={() => setOpenNewCard(true)}
              >
                <Text style={s.btnPrimaryText}>+ Novo Cartão</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Mês (pill igual imagem) */}
        <View style={s.monthRow}>
          <View style={s.monthPill}>
            <MaterialIcons name="calendar-today" size={18} color="#EAF0FF" />
            <Text style={s.monthText}>Janeiro 2026</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color="#EAF0FF"
            />
          </View>
        </View>

        {/* Cards (scroll horizontal igual imagem) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.cardsRow}
        >
          {cards.map((c) => {
            const usadoPct = Math.min(
              100,
              Math.round((c.limiteUsado / c.limiteTotal) * 100)
            );
            const active = c.id === selectedId;

            return (
              <Pressable
                key={c.id}
                onPress={() => setSelectedId(c.id)}
                style={s.cardWrap}
              >
                <LinearGradient
                  colors={c.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.creditCard}
                >
                  <View style={s.ccTop}>
                    <MaterialIcons
                      name="credit-card"
                      size={20}
                      color="rgba(255,255,255,0.85)"
                    />
                    <Text style={s.ccBrand}>{c.bandeira}</Text>
                  </View>

                  <Text style={s.ccNumLabel}>Número do Cartão</Text>
                  <Text style={s.ccNum}>•••• •••• •••• {c.last4}</Text>

                  <Text style={s.ccName}>{c.nome}</Text>

                  <View style={{ marginTop: 10 }}>
                    <Text style={s.ccLimitLabel}>Limite usado</Text>
                    <View style={s.barTrack}>
                      <View style={[s.barFill, { width: `${usadoPct}%` }]} />
                    </View>

                    <View style={s.ccBarRow}>
                      <Text style={s.ccBarText}>{brl(c.limiteUsado)}</Text>
                      <Text style={s.ccBarText}>{brl(c.limiteTotal)}</Text>
                    </View>
                    <Text
                      style={[
                        s.ccBarText,
                        { alignSelf: "flex-end", marginTop: 2 },
                      ]}
                    >
                      {usadoPct}%
                    </Text>
                  </View>

                  {/* destaque do selecionado (bem discreto) */}
                  {active && (
                    <View
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 18,
                        borderWidth: 2,
                        borderColor: "rgba(234,240,255,0.25)",
                      }}
                    />
                  )}
                </LinearGradient>
              </Pressable>
            );
          })}
        </ScrollView>

        {loading && (
          <Text style={{ color: "#EAF0FF", marginTop: 10 }}>Carregando...</Text>
        )}
        {!!error && (
          <Text style={{ color: "#F87171", marginTop: 10, fontWeight: "900" }}>
            {error}
          </Text>
        )}

        {/* GRID (Resumo / Categorias / Parcelas) + (Lista de Gastos) igual imagem */}
        {!loading && !error && selected && (
          <View style={s.gridRow}>
            <View style={s.colLeft}>
              {/* Resumo do Cartão */}
              <View style={s.panel}>
                <View style={s.panelTitleRow}>
                  <Text style={s.panelTitle}>Resumo do Cartão</Text>
                </View>

                <View style={s.kvRow}>
                  <Text style={s.k}>Limite Total</Text>
                  <Text style={s.v}>{brl(selected.limiteTotal)}</Text>
                </View>
                <View style={s.kvRow}>
                  <Text style={s.k}>Limite Usado</Text>
                  <Text style={s.vRed}>{brl(selected.limiteUsado)}</Text>
                </View>
                <View style={s.kvRow}>
                  <Text style={s.k}>Limite Disponível</Text>
                  <Text style={s.vGreen}>{brl(limitDisp)}</Text>
                </View>

                <View style={s.divider} />

                <View style={s.kvRow}>
                  <Text style={s.k}>Fechamento</Text>
                  <Text style={s.v}>Dia {selected.fechamentoDia}</Text>
                </View>
                <View style={s.kvRow}>
                  <Text style={s.k}>Vencimento</Text>
                  <Text style={s.v}>Dia {selected.vencimentoDia}</Text>
                </View>
              </View>

              {/* Por Categoria */}
              <View style={s.panel}>
                <Text style={s.panelTitle}>Por Categoria</Text>
                <View style={s.divider} />
                {categories.map((c: any, idx: number) => (
                  <View key={idx} style={s.kvRow}>
                    <Text style={s.k}>{c.label}</Text>
                    <Text style={s.v}>{brl(c.value)}</Text>
                  </View>
                ))}
              </View>

              {/* Parcelas Ativas */}
              <View style={s.panel}>
                <Text style={s.panelTitle}>Parcelas Ativas</Text>
                <View style={s.divider} />
                {activeInstallments.map((p: any, idx: number) => (
                  <View key={idx} style={{ paddingVertical: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <Text style={s.v}>{p.titulo}</Text>
                        <View style={s.pill}>
                          <Text style={s.pillText}>{p.parcelaLabel}</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={s.v}>{brl(p.valor)}</Text>
                        <Text style={s.expMini}>{p.restanteLabel}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Gastos do mês */}
            <View style={s.colRight}>
              <View style={s.panel}>
                <View style={s.panelTitleRow}>
                  <Text style={s.panelTitle}>Gastos de Janeiro 2026</Text>
                  <View style={s.badgeTotal}>
                    <Text style={s.badgeText}>{brl(totalMes)}</Text>
                  </View>
                </View>

                <View style={s.divider} />

                {expenses.map((e: any) => (
                  <View key={e.id}>
                    <View style={s.expenseRow}>
                      <View style={s.expLeft}>
                        <View
                          style={[
                            s.expIcon,
                            { backgroundColor: "rgba(255,255,255,0.06)" },
                          ]}
                        >
                          <MaterialIcons
                            name="shopping-bag"
                            size={18}
                            color={e.cor}
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text style={s.expTitle}>{e.titulo}</Text>
                          <Text style={s.expSub}>{e.dataLabel}</Text>

                          {e.isInstallment && (
                            <View style={s.pill}>
                              <Text style={s.pillText}>
                                {e.installmentLabel}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={s.expRight}>
                        <Text style={s.expValue}>{brl(e.valor)}</Text>
                        {e.isInstallment && (
                          <Text style={s.expMini}>{e.remainingLabel}</Text>
                        )}
                      </View>
                    </View>

                    <View style={s.divider} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* =========================
          MODAL: Adicionar Novo Cartão (igual imagem)
         ========================= */}
      <Modal
        visible={openNewCard}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenNewCard(false)}
      >
        <Pressable
          style={ModaGlobalStyles.modalContainer}
          onPress={() => setOpenNewCard(false)}
        >
          <Pressable style={ModaGlobalStyles.modalContent} onPress={() => {}}>
            <View style={ModaGlobalStyles.headerRow}>
              <Text style={ModaGlobalStyles.modalTitle}>
                Adicionar Novo Cartão
              </Text>
              <TouchableOpacity
                style={ModaGlobalStyles.closeButton}
                onPress={() => setOpenNewCard(false)}
              >
                <MaterialIcons name="close" size={18} color="#EAF0FF" />
              </TouchableOpacity>
            </View>

            {/* Campos iguais imagem */}
            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Nome do Cartão</Text>
              <TextInput
                style={ModaGlobalStyles.input}
                placeholder="Ex: Nubank, Itaú..."
                placeholderTextColor="rgba(234,240,255,0.35)"
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>
                  Últimos 4 dígitos
                </Text>
                <TextInput
                  style={ModaGlobalStyles.input}
                  placeholder="0000"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>Bandeira</Text>
                <TextInput
                  style={ModaGlobalStyles.input}
                  placeholder="Visa"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                />
              </View>
            </View>

            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Limite Total</Text>
              <TextInput
                style={ModaGlobalStyles.input}
                placeholder="5000"
                placeholderTextColor="rgba(234,240,255,0.35)"
                keyboardType="numeric"
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>
                  Dia do Fechamento
                </Text>
                <TextInput
                  style={ModaGlobalStyles.input}
                  placeholder="15"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                  keyboardType="numeric"
                />
              </View>

              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>
                  Dia do Vencimento
                </Text>
                <TextInput
                  style={ModaGlobalStyles.input}
                  placeholder="25"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={[ModaGlobalStyles.inputLabel, { marginBottom: 8 }]}>
              Cor do Cartão
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
              {[
                "#3B82F6",
                "#8B5CF6",
                "#22C55E",
                "#EF4444",
                "#F97316",
                "#EC4899",
                "#64748B",
              ].map((c) => (
                <View
                  key={c}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 99,
                    backgroundColor: c,
                  }}
                />
              ))}
            </View>

            <TouchableOpacity
              style={ModaGlobalStyles.buttonSucess}
              onPress={() => setOpenNewCard(false)}
            >
              <Text style={ModaGlobalStyles.buttonText}>Adicionar Cartão</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* =========================
          MODAL: Adicionar Novo Gasto (igual imagem)
         ========================= */}
      <Modal
        visible={openNewExpense}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenNewExpense(false)}
      >
        <Pressable
          style={ModaGlobalStyles.modalContainer}
          onPress={() => setOpenNewExpense(false)}
        >
          <Pressable style={ModaGlobalStyles.modalContent} onPress={() => {}}>
            <View style={ModaGlobalStyles.headerRow}>
              <Text style={ModaGlobalStyles.modalTitle}>
                Adicionar Novo Gasto
              </Text>
              <TouchableOpacity
                style={ModaGlobalStyles.closeButton}
                onPress={() => setOpenNewExpense(false)}
              >
                <MaterialIcons name="close" size={18} color="#EAF0FF" />
              </TouchableOpacity>
            </View>

            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Cartão</Text>
              <TextInput
                style={ModaGlobalStyles.input}
                placeholder="Nubank •••• 4532"
                placeholderTextColor="rgba(234,240,255,0.35)"
              />
            </View>

            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Descrição</Text>
              <TextInput
                style={ModaGlobalStyles.input}
                placeholder="Ex: Amazon - iPhone Case"
                placeholderTextColor="rgba(234,240,255,0.35)"
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>Valor Total</Text>
                <TextInput
                  style={ModaGlobalStyles.input}
                  placeholder="99,90"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>Data</Text>
                <TextInput
                  style={ModaGlobalStyles.input}
                  placeholder="01/01/2026"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                />
              </View>
            </View>

            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Categoria</Text>
              <TextInput
                style={ModaGlobalStyles.input}
                placeholder="Compras"
                placeholderTextColor="rgba(234,240,255,0.35)"
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View>
                <Text style={ModaGlobalStyles.inputLabel}>Parcelado</Text>
                <Text style={ModaGlobalStyles.helperText}>
                  Dividir em parcelas
                </Text>
              </View>
              <View
                style={{
                  width: 46,
                  height: 26,
                  borderRadius: 99,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 99,
                    backgroundColor: "#2BE080",
                    marginLeft: 22,
                  }}
                />
              </View>
            </View>

            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>
                Número de Parcelas
              </Text>
              <TextInput
                style={ModaGlobalStyles.input}
                placeholder="12"
                placeholderTextColor="rgba(234,240,255,0.35)"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={ModaGlobalStyles.buttonSucess}
              onPress={() => setOpenNewExpense(false)}
            >
              <Text style={ModaGlobalStyles.buttonText}>Adicionar Gasto</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}