import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";

interface ConfigGastoMesModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { limiteGastoMes: number; mes: number; ano: number }) => void;
}

/**
 * 📍 Arquivo: components/ConfigGastoMesModal.tsx
 * Modal para configurar limite de gastos do mês.
 * Mantém a regra de salvar (onSave) e apenas moderniza o layout.
 */
const ConfigGastoMesModal: React.FC<ConfigGastoMesModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [limiteGastoMes, setLimiteGastoMes] = useState("");

  const mes = useMemo(
    () => new Date().getMonth() + 1,
    []
  );
  const ano = useMemo(() => new Date().getFullYear(), []);

  const canSave = useMemo(
    () => limiteGastoMes.trim().length > 0,
    [limiteGastoMes]
  );

  const handleSave = () => {
    if (!canSave) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    onSave({ limiteGastoMes: parseFloat(limiteGastoMes), mes, ano });
    setLimiteGastoMes("");
    onClose();
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
            <Text style={ModaGlobalStyles.modalTitle}>Limite do mês</Text>
            <TouchableOpacity
              style={ModaGlobalStyles.closeButton}
              onPress={onClose}
              accessibilityLabel="Fechar modal"
            >
              <MaterialIcons name="close" size={18} color="#EAF0FF" />
            </TouchableOpacity>
          </View>

          <Text style={ModaGlobalStyles.modalMessage}>
            Defina o limite de gastos variáveis para {mes} de {ano}.
          </Text>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Limite (R$)</Text>
            <TextInput
              style={ModaGlobalStyles.input}
              placeholder="Ex: 1200"
              placeholderTextColor="rgba(234,240,255,0.45)"
              value={limiteGastoMes}
              onChangeText={setLimiteGastoMes}
              keyboardType="numeric"
            />
          </View>

          <View style={ModaGlobalStyles.buttonContainer}>
            <TouchableOpacity
              style={[
                ModaGlobalStyles.buttonSucess,
                !canSave && ModaGlobalStyles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={ModaGlobalStyles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ModaGlobalStyles.buttonCancelar}
              onPress={onClose}
            >
              <Text style={ModaGlobalStyles.buttonTextLight}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfigGastoMesModal;
