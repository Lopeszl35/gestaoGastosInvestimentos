import React, { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";
import { useUser } from "@/context/UserContext";

import type { PaymentMethod } from "@/domain/payment";
import { PAYMENT_METHODS, PaymentMethodLabel } from "@/domain/payment";
import type { CreditCard } from "@/domain/cartao";
import { getCartoesCredito } from "@/services/cartoesService";

interface AddGastosModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    idCategoria: number;
    valor: number;
    descricao: string;
    dataGasto: string;

    // 🔥 NOVO: forma de pagamento + cartão (quando crédito)
    formaPagamento: PaymentMethod;
    idCartao?: number | null;
  }) => void;
  nomeCategoria: string;
  idCategoria: number;
}

/**
 * 📍 Arquivo: components/addGastosModal.tsx
 * Modal para adicionar gasto em uma categoria.
 * Regra: UI apenas. Campos e validações leves (UX). Regras/integrações ficam em services/domain.
 *
 * ✅ NOVO: seleção de forma de pagamento.
 * - Dinheiro / PIX / Débito / Crédito
 * - Se Crédito: carrega e permite escolher um cartão cadastrado.
 */
const AddGastosModal: React.FC<AddGastosModalProps> = ({
  visible,
  onClose,
  onSave,
  nomeCategoria,
  idCategoria,
}) => {
  const { user } = useUser();

  const [gastos, setGastos] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataGasto, setDataGasto] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 🔥 NOVO
  const [formaPagamento, setFormaPagamento] = useState<PaymentMethod>("DINHEIRO");
  const [cartoes, setCartoes] = useState<CreditCard[]>([]);
  const [idCartao, setIdCartao] = useState<number | null>(null);
  const [loadingCartoes, setLoadingCartoes] = useState(false);
  const [erroCartoes, setErroCartoes] = useState<string | null>(null);

  const dataLabel = useMemo(() => {
    const d = dataGasto ?? new Date();
    return d.toLocaleDateString("pt-BR");
  }, [dataGasto]);

  const valorNumber = useMemo(() => {
    // aceita vírgula/ ponto
    const v = Number(String(gastos).replace(",", "."));
    return Number.isFinite(v) ? v : 0;
  }, [gastos]);

  const canSave = useMemo(() => {
    if (!dataGasto) return false;
    if (valorNumber <= 0) return false;
    if (formaPagamento === "CREDITO" && !idCartao) return false;
    return true;
  }, [dataGasto, valorNumber, formaPagamento, idCartao]);

  // Reset quando abre
  useEffect(() => {
    if (!visible) return;
    setGastos("");
    setDescricao("");
    setDataGasto(new Date());
    setShowDatePicker(false);
    setFormaPagamento("DINHEIRO");
    setCartoes([]);
    setIdCartao(null);
    setLoadingCartoes(false);
    setErroCartoes(null);
  }, [visible]);

  // Carrega cartões quando seleciona Crédito
  useEffect(() => {
    if (!visible) return;
    if (formaPagamento !== "CREDITO") {
      setIdCartao(null);
      setErroCartoes(null);
      return;
    }

    if (!user?.id_usuario) {
      setErroCartoes("Usuário não carregado.");
      return;
    }

    (async () => {
      try {
        setErroCartoes(null);
        setLoadingCartoes(true);
        const lista = await getCartoesCredito(user.id_usuario);
        setCartoes(lista);

        // UX: se só tiver 1 cartão, seleciona automaticamente
        if (lista.length === 1) setIdCartao(lista[0].id_cartao);
      } catch (e: any) {
        setErroCartoes(e?.message || "Erro ao carregar cartões.");
        setCartoes([]);
      } finally {
        setLoadingCartoes(false);
      }
    })();
  }, [formaPagamento, visible, user?.id_usuario]);

  const handleSave = () => {
    if (!dataGasto) {
      alert("Por favor, selecione a data do gasto.");
      return;
    }
    if (valorNumber <= 0) {
      alert("Informe um valor válido.");
      return;
    }
    if (formaPagamento === "CREDITO" && !idCartao) {
      alert("Selecione um cartão para pagamento no crédito.");
      return;
    }

    onSave({
      idCategoria,
      valor: valorNumber,
      descricao,
      dataGasto: dataGasto.toISOString().split("T")[0],
      formaPagamento,
      idCartao: formaPagamento === "CREDITO" ? idCartao : null,
    });

    onClose();
  };

  const onChangeDate = (_: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (selectedDate) setDataGasto(selectedDate);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={ModaGlobalStyles.modalContainer}>
        <View style={ModaGlobalStyles.modalContent}>
          <View style={ModaGlobalStyles.headerRow}>
            <Text style={ModaGlobalStyles.modalTitle}>Adicionar gasto</Text>
            <TouchableOpacity
              style={ModaGlobalStyles.closeButton}
              onPress={onClose}
              accessibilityLabel="Fechar modal"
            >
              <MaterialIcons name="close" size={18} color="#EAF0FF" />
            </TouchableOpacity>
          </View>

          <Text style={ModaGlobalStyles.modalMessage}>
            Categoria: <Text style={ModaGlobalStyles.modalMessageStrong}>{nomeCategoria}</Text>
          </Text>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Valor (R$)</Text>
            <TextInput
              style={ModaGlobalStyles.input}
              placeholder="Ex: 45,90"
              placeholderTextColor="rgba(234,240,255,0.45)"
              value={gastos}
              onChangeText={setGastos}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Descrição (opcional)</Text>
            <TextInput
              style={ModaGlobalStyles.input}
              placeholder="Ex: Uber, mercado, lanche..."
              placeholderTextColor="rgba(234,240,255,0.45)"
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Data do gasto</Text>
            <TouchableOpacity
              style={[
                ModaGlobalStyles.dateInput,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: "#EAF0FF", fontWeight: "900" }}>{dataLabel}</Text>
              <MaterialIcons
                name="calendar-today"
                size={18}
                color="rgba(234,240,255,0.75)"
              />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dataGasto ?? new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
            />
          )}

          {/* 🔥 Forma de pagamento */}
          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Forma de pagamento</Text>

            <View style={ModaGlobalStyles.segmentRow}>
              {PAYMENT_METHODS.map((m) => {
                const active = formaPagamento === m;
                return (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setFormaPagamento(m)}
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
                      {PaymentMethodLabel[m]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 🔥 Se crédito: escolher cartão */}
          {formaPagamento === "CREDITO" && (
            <View style={ModaGlobalStyles.inputContainer}>
              <Text style={ModaGlobalStyles.inputLabel}>Cartão de crédito</Text>

              {loadingCartoes ? (
                <Text style={ModaGlobalStyles.helperText}>Carregando cartões...</Text>
              ) : erroCartoes ? (
                <Text style={ModaGlobalStyles.errorText}>{erroCartoes}</Text>
              ) : cartoes.length === 0 ? (
                      <View>
                        <Text style={ModaGlobalStyles.helperText}>
                          Você ainda não cadastrou um cartão. Cadastre um cartão para lançar gastos no crédito.
                        </Text>

                        <View style={{ marginTop: 10 }}>
                          <TouchableOpacity
                            style={ModaGlobalStyles.buttonSucess}
                            onPress={() => {
                              onClose(); // fecha o modal pra não ficar por cima
                              router.push("/cartoes"); // leva o usuário pra cadastrar
                            }}
                          >
                            <Text style={ModaGlobalStyles.buttonText}>Ir para Cartões</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[ModaGlobalStyles.buttonCancelar, { marginTop: 10 }]}
                            onPress={onClose}
                          >
                            <Text style={ModaGlobalStyles.buttonTextLight}>Agora não</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                <View style={ModaGlobalStyles.selectList}>
                  {cartoes.map((c) => {
                    const selected = idCartao === c.id_cartao;
                    return (
                      <TouchableOpacity
                        key={c.id_cartao}
                        onPress={() => setIdCartao(c.id_cartao)}
                        style={[
                          ModaGlobalStyles.selectItem,
                          selected && ModaGlobalStyles.selectItemActive,
                        ]}
                      >
                        <Text style={ModaGlobalStyles.selectItemTitle}>{c.nome}</Text>
                        {!!c.bandeira && (
                          <Text style={ModaGlobalStyles.selectItemSub}>{c.bandeira}</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          <View style={ModaGlobalStyles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSave}
              style={[
                ModaGlobalStyles.buttonSucess,
                !canSave && ModaGlobalStyles.buttonDisabled,
              ]}
              disabled={!canSave}
            >
              <Text style={ModaGlobalStyles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={ModaGlobalStyles.buttonCancelar}
            >
              <Text style={ModaGlobalStyles.buttonTextLight}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddGastosModal;
