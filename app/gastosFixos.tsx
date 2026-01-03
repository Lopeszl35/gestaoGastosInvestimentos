import React, { useState } from "react";
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

import { GastosFixosStyles as s } from "@/styles/GastosFixosStyles";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";
import { useGastosFixosScreen } from "@/hooks/gastosFixos/useGastosFixosScreen";

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function iconName(type: string) {
  switch (type) {
    case "bolt":
      return "bolt";
    case "water":
      return "water-drop";
    case "wifi":
      return "wifi";
    case "movie":
      return "movie";
    case "music":
      return "music-note";
    case "fitness":
      return "fitness-center";
    default:
      return "receipt-long";
  }
}

export default function GastosFixos() {
  const { loading, error, data } = useGastosFixosScreen();
  const [open, setOpen] = useState(false);

  return (
    <View style={s.screen}>
      <ScrollView
        style={s.container}
        contentContainerStyle={{ paddingBottom: 26 }}
      >
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Text style={s.h1}>Gastos Fixos</Text>
            <Text style={s.h2}>Gerencie suas despesas recorrentes mensais</Text>
          </View>

          <View style={s.headerRight}>
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="rgba(234,240,255,0.35)"
              style={s.search}
            />
            <Pressable style={s.btnPrimary} onPress={() => setOpen(true)}>
              <Text style={s.btnPrimaryText}>+ Novo Gasto Fixo</Text>
            </Pressable>
          </View>
        </View>

        {loading && (
          <Text style={{ color: "#EAF0FF", marginTop: 10 }}>Carregando...</Text>
        )}
        {!!error && (
          <Text style={{ color: "#F87171", marginTop: 10, fontWeight: "900" }}>
            {error}
          </Text>
        )}

        {!loading && !error && data && (
          <>
            {/* Cards topo (3) igual imagem */}
            <View style={s.cardsTop}>
              <View style={s.metric}>
                <Text style={s.metricLabel}>Total Mensal</Text>
                <Text style={s.metricValue}>{brl(data.totalMensal)}</Text>
                <Text style={s.metricSub}>9 despesas ativas</Text>
              </View>

              <View style={s.metric}>
                <Text style={s.metricLabel}>Total Anual</Text>
                <Text style={s.metricValue}>{brl(data.totalAnual)}</Text>
                <Text style={s.metricSub}>Projeção para 12 meses</Text>
              </View>

              <View style={s.metric}>
                <Text style={s.metricLabel}>Próximos 7 dias</Text>
                <Text style={s.metricValue}>{brl(data.proximos7dias)}</Text>
                <Text style={s.metricSub}>4 vencimentos</Text>
              </View>
            </View>

            {/* Painel categoria igual imagem */}
            <View style={s.panel}>
              <Text style={s.panelTitle}>Gastos por Categoria</Text>
              <View style={s.catRow}>
                {data.porCategoria.map((c: any) => (
                  <View key={c.label} style={s.catPill}>
                    <Text style={s.catName}>{c.label}</Text>
                    <Text style={s.catValue}>{brl(c.value)}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Grid cards igual imagem */}
            <View style={s.grid}>
              {data.items.map((i: any) => (
                <LinearGradient
                  key={i.id}
                  colors={i.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.item}
                >
                  <View style={s.itemInner}>
                    <View style={s.itemTop}>
                      <View style={s.iconCircle}>
                        <MaterialIcons
                          name={iconName(i.icon) as any}
                          size={18}
                          color="#EAF0FF"
                        />
                      </View>

                      <View style={s.switch}>
                        <View style={s.knobOn} />
                      </View>
                    </View>

                    <Text style={s.itemTitle}>{i.nome}</Text>
                    <View style={s.tag}>
                      <Text style={s.tagText}>{i.categoria}</Text>
                    </View>

                    <Text style={s.itemValue}>{brl(i.valor)}</Text>
                    <Text style={s.itemDue}>Vence dia {i.vencimentoDia}</Text>
                  </View>
                </LinearGradient>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal igual imagem: Adicionar Gasto Fixo */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={ModaGlobalStyles.modalContainer}
          onPress={() => setOpen(false)}
        >
          <Pressable style={ModaGlobalStyles.modalContent} onPress={() => {}}>
            <View style={ModaGlobalStyles.headerRow}>
              <Text style={ModaGlobalStyles.modalTitle}>
                Adicionar Gasto Fixo
              </Text>
              <TouchableOpacity
                style={ModaGlobalStyles.closeButton}
                onPress={() => setOpen(false)}
              >
                <MaterialIcons name="close" size={18} color="#EAF0FF" />
              </TouchableOpacity>
            </View>

            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Nome</Text>
              <TextInput
                style={ModaGlobalStyles.input}
                placeholder="Ex: Conta de Luz, Netflix..."
                placeholderTextColor="rgba(234,240,255,0.35)"
              />
            </View>

            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Categoria</Text>
              <TextInput
                style={ModaGlobalStyles.input}
                placeholder="Utilidades (Luz, Água, Gás)"
                placeholderTextColor="rgba(234,240,255,0.35)"
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>Valor Mensal</Text>
                <TextInput
                  style={ModaGlobalStyles.input}
                  placeholder="150,00"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>
                  Dia do Vencimento
                </Text>
                <TextInput
                  style={ModaGlobalStyles.input}
                  placeholder="10"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={ModaGlobalStyles.buttonSucess}
              onPress={() => setOpen(false)}
            >
              <Text style={ModaGlobalStyles.buttonText}>Adicionar Gasto</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}