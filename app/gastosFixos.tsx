import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

import { GastosFixosStyles as s } from "@/styles/GastosFixosStyles";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";
import { useGastosFixosScreen } from "@/hooks/gastosFixos/useGastosFixosScreen";
import { useUser } from "@/context/UserContext";

import { addGastoFixo, toggleGastoFixoAtivo } from "@/services/gastosFixosService";

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Mapeamento obrigatório por tipo -> { icon, gradient }
 * (do jeito que você especificou)
 */
function mapTipoToVisual(tipo: string): { icon: any; gradient: [string, string] } {
  switch (tipo) {
    case "luz":
      return { icon: "bolt", gradient: ["#3B2F20", "#6B4E2E"] };
    case "agua":
      return { icon: "water-drop", gradient: ["#3B2F20", "#6B4E2E"] };
    case "internet":
      return { icon: "wifi", gradient: ["#0B2B4B", "#155E75"] };
    case "assinatura":
      return { icon: "movie", gradient: ["#0B2B4B", "#155E75"] };
    case "telefone":
      return { icon: "receipt-long", gradient: ["#3B2F20", "#6B4E2E"] };
    default:
      return { icon: "receipt-long", gradient: ["#1F2937", "#111827"] };
  }
}

type TipoOption = {
  label: string;
  value: "luz" | "agua" | "internet" | "assinatura" | "telefone" | "outro";
};

const TIPO_OPTIONS: TipoOption[] = [
  { label: "Utilidades - Luz", value: "luz" },
  { label: "Utilidades - Água", value: "agua" },
  { label: "Assinaturas - Internet", value: "internet" },
  { label: "Assinaturas - Streaming", value: "assinatura" },
  { label: "Utilidades - Telefone", value: "telefone" },
  { label: "Outros", value: "outro" },
];

type RecOption = { label: string; value: "mensal" | "bimestral" | "trimestral" | "anual" };
const REC_OPTIONS: RecOption[] = [
  { label: "Mensal", value: "mensal" },
  { label: "Bimestral", value: "bimestral" },
  { label: "Trimestral", value: "trimestral" },
  { label: "Anual", value: "anual" },
];

export default function GastosFixos() {
  const { user } = useUser();
  const { loading, error, data, reload } = useGastosFixosScreen();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Loading por item no toggle
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Form do modal
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<TipoOption["value"] | "">("");
  const [valor, setValor] = useState("");
  const [diaVenc, setDiaVenc] = useState("");
  const [recorrencia, setRecorrencia] = useState<RecOption["value"]>("mensal");
  const [creating, setCreating] = useState(false);
  const [showTipoPicker, setShowTipoPicker] = useState(false);


  const lista = useMemo(() => (data?.lista && Array.isArray(data.lista) ? data.lista : []), [data]);
  const resumo = data?.resumo ?? null;
  const gastosPorCategoria = useMemo(
    () => (data?.gastosPorCategoria && Array.isArray(data.gastosPorCategoria) ? data.gastosPorCategoria : []),
    [data]
  );

  const ativosCount = useMemo(() => lista.filter((i: any) => Number(i.ativo) === 1).length, [lista]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter((i: any) => String(i.titulo || "").toLowerCase().includes(q));
  }, [lista, search]);

  const resetModal = useCallback(() => {
    setTitulo("");
    setTipo("");
    setValor("");
    setDiaVenc("");
    setRecorrencia("mensal");
    setCreating(false);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    resetModal();
  }, [resetModal]);

  const handleToggle = useCallback(
    async (item: any) => {
      try {
        const id_usuario = (user as any)?.id_usuario;
        if (!id_usuario) throw new Error("Usuário não autenticado.");

        const id_gasto_fixo = Number(item.id_gasto_fixo);
        const novoAtivo: 0 | 1 = Number(item.ativo) === 1 ? 0 : 1;

        setTogglingId(id_gasto_fixo);
        await toggleGastoFixoAtivo(id_usuario, id_gasto_fixo, novoAtivo);
        await reload();
      } catch (e: any) {
        Alert.alert("Erro", e?.message || "Erro ao atualizar status do gasto fixo.");
      } finally {
        setTogglingId(null);
      }
    },
    [user, reload]
  );

  const handleCreate = useCallback(async () => {
    try {
      const id_usuario = (user as any)?.id_usuario;
      if (!id_usuario) throw new Error("Usuário não autenticado.");

      const t = titulo.trim();
      if (t.length < 2) {
        Alert.alert("Atenção", "Informe um nome com pelo menos 2 caracteres.");
        return;
      }
      if (!tipo) {
        Alert.alert("Atenção", "Selecione uma categoria.");
        return;
      }

      const v = Number(String(valor).replace(",", "."));
      if (!Number.isFinite(v) || v <= 0) {
        Alert.alert("Atenção", "Informe um valor válido (maior que 0).");
        return;
      }

      const dia = Number(diaVenc);
      if (!Number.isFinite(dia) || dia < 1 || dia > 31) {
        Alert.alert("Atenção", "Dia do vencimento deve estar entre 1 e 31.");
        return;
      }

      const gastoFixo = {
        tipo,
        titulo: t,
        descricao: null,
        valor: v,
        dia_vencimento: dia,
        recorrencia: recorrencia || "mensal",
        ativo: 1,
      };

      setCreating(true);
      await addGastoFixo(id_usuario, gastoFixo);
      closeModal();
      await reload();
      Alert.alert("Sucesso", "Gasto fixo criado com sucesso!");
    } catch (e: any) {
      Alert.alert("Erro", e?.message || "Erro ao criar gasto fixo.");
    } finally {
      setCreating(false);
    }
  }, [user, titulo, tipo, valor, diaVenc, recorrencia, closeModal, reload]);

  return (
    <View style={s.screen}>
      <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 26 }}>
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Text style={s.h1}>Gastos Fixos</Text>
            <Text style={s.h2}>Gerencie suas despesas recorrentes mensais</Text>
          </View>

          <View style={s.headerRight}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar..."
              placeholderTextColor="rgba(234,240,255,0.35)"
              style={s.search}
            />
            <Pressable style={s.btnPrimary} onPress={() => setOpen(true)}>
              <Text style={s.btnPrimaryText}>+ Novo Gasto Fixo</Text>
            </Pressable>
          </View>
        </View>

        {loading && <Text style={{ color: "#EAF0FF", marginTop: 10 }}>Carregando...</Text>}
        {!!error && (
          <Text style={{ color: "#F87171", marginTop: 10, fontWeight: "900" }}>{error}</Text>
        )}

        {!loading && !error && resumo && (
          <>
            {/* Cards topo */}
            <View style={s.cardsTop}>
              <View style={s.metric}>
                <Text style={s.metricLabel}>Total Mensal</Text>
                <Text style={s.metricValue}>{brl(Number(resumo.totalMensal || 0))}</Text>
                <Text style={s.metricSub}>{ativosCount} despesas ativas</Text>
              </View>

              <View style={s.metric}>
                <Text style={s.metricLabel}>Total Anual</Text>
                <Text style={s.metricValue}>{brl(Number(resumo.totalAnual || 0))}</Text>
                <Text style={s.metricSub}>Projeção para 12 meses</Text>
              </View>

              <View style={s.metric}>
                <Text style={s.metricLabel}>Próximos 7 dias</Text>
                <Text style={s.metricValue}>{brl(Number(resumo.proximos7Dias?.total || 0))}</Text>
                <Text style={s.metricSub}>{Number(resumo.proximos7Dias?.quantidade || 0)} vencimentos</Text>
              </View>
            </View>

            {/* Painel Gastos por Categoria */}
            <View style={s.panel}>
              <Text style={s.panelTitle}>Gastos por Categoria</Text>
              <View style={s.catRow}>
                {gastosPorCategoria.map((c: any) => (
                  <View key={String(c.categoria)} style={s.catPill}>
                    <Text style={s.catName}>{c.categoria}</Text>
                    <Text style={s.catValue}>{brl(Number(c.total || 0))}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Empty state */}
            {lista.length === 0 && (
              <View style={s.emptyBox}>
                <Text style={s.emptyText}>Nenhum gasto fixo cadastrado ainda.</Text>
                <TouchableOpacity style={s.emptyCta} onPress={() => setOpen(true)}>
                  <Text style={s.emptyCtaText}>+ Novo Gasto Fixo</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Grid */}
            {lista.length > 0 && (
              <View style={s.grid}>
                {filtered.map((i: any) => {
                  const { icon, gradient } = mapTipoToVisual(i.tipo);
                  const ativo = Number(i.ativo) === 1;
                  const isToggling = togglingId === Number(i.id_gasto_fixo);

                  return (
                    <LinearGradient
                      key={String(i.id_gasto_fixo)}
                      colors={gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={s.item}
                    >
                      <View style={s.itemInner}>
                        <View style={s.itemTop}>
                          <View style={s.iconCircle}>
                            <MaterialIcons name={icon} size={18} color="#EAF0FF" />
                          </View>

                          {/* Switch real */}
                          <TouchableOpacity
                            style={[s.switch, !ativo && s.switchOff]}
                            onPress={() => handleToggle(i)}
                            disabled={isToggling}
                            accessibilityLabel="Alternar ativo"
                          >
                            {isToggling ? (
                              <ActivityIndicator size="small" color="#EAF0FF" />
                            ) : (
                              <View style={[s.knobOn, !ativo && s.knobOff]} />
                            )}
                          </TouchableOpacity>
                        </View>

                        <Text style={s.itemTitle}>{i.titulo}</Text>
                        <View style={s.tag}>
                          <Text style={s.tagText}>{i.categoria_exibicao}</Text>
                        </View>

                        <Text style={s.itemValue}>{brl(Number(i.valor || 0))}</Text>
                        <Text style={s.itemDue}>Vence dia {Number(i.dia_vencimento || 0)}</Text>
                      </View>
                    </LinearGradient>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Modal: Adicionar Gasto Fixo */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={ModaGlobalStyles.modalContainer} onPress={closeModal}>
          <Pressable style={ModaGlobalStyles.modalContent} onPress={() => {}}>
            <View style={ModaGlobalStyles.headerRow}>
              <Text style={ModaGlobalStyles.modalTitle}>Adicionar Gasto Fixo</Text>
              <TouchableOpacity style={ModaGlobalStyles.closeButton} onPress={closeModal}>
                <MaterialIcons name="close" size={18} color="#EAF0FF" />
              </TouchableOpacity>
            </View>

            {/* Nome */}
            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Nome</Text>
              <TextInput
                value={titulo}
                onChangeText={setTitulo}
                style={ModaGlobalStyles.input}
                placeholder="Ex: Conta de Luz, Netflix..."
                placeholderTextColor="rgba(234,240,255,0.35)"
              />
            </View>

            {/* Categoria => SELECT de TIPO */}
           <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Categoria</Text>

            <TouchableOpacity
              style={s.selectField}
              onPress={() => setShowTipoPicker(true)}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={s.selectFieldValue}>
                  {tipo
                    ? TIPO_OPTIONS.find((o) => o.value === tipo)?.label
                    : "Selecione uma categoria"}
                </Text>
                <Text style={s.selectFieldHint}>
                  Toque para abrir a lista
                </Text>
              </View>

              <MaterialIcons name="keyboard-arrow-down" size={22} color="rgba(234,240,255,0.75)" />
            </TouchableOpacity>
          </View>


            {/* Valor + Dia */}
            <View style={s.row2}>
              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>Valor Mensal</Text>
                <TextInput
                  value={valor}
                  onChangeText={setValor}
                  style={ModaGlobalStyles.input}
                  placeholder="150,00"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[ModaGlobalStyles.inputContainer, { flex: 1 }]}>
                <Text style={ModaGlobalStyles.inputLabel}>Dia do Vencimento</Text>
                <TextInput
                  value={diaVenc}
                  onChangeText={setDiaVenc}
                  style={ModaGlobalStyles.input}
                  placeholder="10"
                  placeholderTextColor="rgba(234,240,255,0.35)"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Recorrência (opcional) */}
            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Recorrência</Text>

              <View style={ModaGlobalStyles.segmentRow}>
                {REC_OPTIONS.map((r) => {
                  const active = recorrencia === r.value;
                  return (
                    <TouchableOpacity
                      key={r.value}
                      onPress={() => setRecorrencia(r.value)}
                      style={[
                        ModaGlobalStyles.segmentItem,
                        active && ModaGlobalStyles.segmentItemActive,
                      ]}
                    >
                      <Text
                        style={[
                          ModaGlobalStyles.segmentText,
                          active && ModaGlobalStyles.segmentTextActive,
                        ]}
                      >
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              style={[ModaGlobalStyles.buttonSucess, creating && { opacity: 0.7 }]}
              onPress={handleCreate}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color="#0B1220" />
              ) : (
                <Text style={ModaGlobalStyles.buttonText}>Adicionar Gasto</Text>
              )}
            </TouchableOpacity>
          </Pressable>
        </Pressable>

        <Modal
          visible={showTipoPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTipoPicker(false)}
        >
          <View style={s.pickerOverlay}>
            <View style={s.pickerCard}>
              <View style={s.pickerHeader}>
                <Text style={s.pickerTitle}>Selecionar categoria</Text>
                <TouchableOpacity
                  onPress={() => setShowTipoPicker(false)}
                  style={ModaGlobalStyles.closeButton}
                >
                  <MaterialIcons name="close" size={18} color="#EAF0FF" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={s.pickerList}>
                {TIPO_OPTIONS.map((opt) => {
                  const selected = tipo === opt.value;

                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        s.pickerItem,
                        selected && s.pickerItemActive,
                      ]}
                      onPress={() => {
                        setTipo(opt.value);
                        setShowTipoPicker(false);
                      }}
                    >
                      <Text style={s.pickerItemTitle}>{opt.label}</Text>
                      <Text style={s.pickerItemSub}>
                        {selected ? "Selecionado" : "Toque para selecionar"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

      </Modal>
    </View>
  );
}
