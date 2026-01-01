import React, { useMemo, useState } from "react";
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

interface AddGastosModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    idCategoria: number;
    valor: number;
    descricao: string;
    dataGasto: string;
  }) => void;
  nomeCategoria: string;
  idCategoria: number;
}

/**
 * 📍 Arquivo: components/addGastosModal.tsx
 * Modal para adicionar gasto em uma categoria.
 * Mantém a lógica/props; melhora o layout e a experiência de data.
 */
const AddGastosModal: React.FC<AddGastosModalProps> = ({
  visible,
  onClose,
  onSave,
  nomeCategoria,
  idCategoria,
}) => {
  const [gastos, setGastos] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataGasto, setDataGasto] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dataLabel = useMemo(() => {
    const d = dataGasto ?? new Date();
    return d.toLocaleDateString("pt-BR");
  }, [dataGasto]);

  const canSave = useMemo(
    () => gastos.trim().length > 0 && !!dataGasto,
    [gastos, dataGasto]
  );

  const handleSave = () => {
    if (!gastos || !dataGasto) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    onSave({
      idCategoria,
      valor: parseFloat(gastos),
      descricao,
      dataGasto: dataGasto.toISOString().split("T")[0],
    });

    setGastos("");
    setDataGasto(new Date());
    setDescricao("");
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
            Categoria:{" "}
            <Text style={{ fontWeight: "900", color: "#EAF0FF" }}>
              {nomeCategoria}
            </Text>
          </Text>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Valor (R$)</Text>
            <TextInput
              style={ModaGlobalStyles.input}
              placeholder="Ex: 45.90"
              placeholderTextColor="rgba(234,240,255,0.45)"
              value={gastos}
              onChangeText={setGastos}
              keyboardType="numeric"
            />
          </View>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>
              Descrição (opcional)
            </Text>
            <TextInput
              style={ModaGlobalStyles.input}
              placeholder="Ex: mercado, lanche..."
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
              <Text style={{ color: "#EAF0FF", fontWeight: "900" }}>
                {dataLabel}
              </Text>
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
