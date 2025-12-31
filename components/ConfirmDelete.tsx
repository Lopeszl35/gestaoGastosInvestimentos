import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";

interface ConfirmDeleteProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

/**
 * 📍 Arquivo: components/ConfirmDelete.tsx
 * Modal de confirmação de exclusão.
 * Mantém props e callbacks; atualiza layout para o padrão premium/dark.
 */
const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  visible,
  onClose,
  onConfirm,
  message,
}) => {
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
            <Text style={ModaGlobalStyles.modalTitle}>Confirmar exclusão</Text>
            <TouchableOpacity
              style={ModaGlobalStyles.closeButton}
              onPress={onClose}
              accessibilityLabel="Fechar modal"
            >
              <MaterialIcons name="close" size={18} color="#EAF0FF" />
            </TouchableOpacity>
          </View>

          <Text style={ModaGlobalStyles.modalMessage}>{message}</Text>

          <View style={ModaGlobalStyles.buttonContainer}>
            <TouchableOpacity
              style={ModaGlobalStyles.buttonDanger}
              onPress={onConfirm}
            >
              <Text style={ModaGlobalStyles.buttonText}>Excluir</Text>
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

export default ConfirmDelete;
