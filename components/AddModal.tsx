import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";

interface AddModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { nome: string; limite: number }) => void;
}

const AddModal: React.FC<AddModalProps> = ({ visible, onClose, onSave }) => {
  const [nome, setNome] = useState("");
  const [limite, setLimite] = useState("");

  const canSave = useMemo(
    () => nome.trim().length > 0 && limite.trim().length > 0,
    [nome, limite]
  );

  const handleSave = () => {
    if (!canSave) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    onSave({ nome: nome.trim(), limite: Number(limite) });
    setNome("");
    setLimite("");
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
            <Text style={ModaGlobalStyles.modalTitle}>Nova Categoria</Text>
            <TouchableOpacity
              style={ModaGlobalStyles.closeButton}
              onPress={onClose}
              accessibilityLabel="Fechar modal"
            >
              <MaterialIcons name="close" size={18} color="#EAF0FF" />
            </TouchableOpacity>
          </View>

          <Text style={ModaGlobalStyles.modalMessage}>
            Crie uma categoria para acompanhar seus gastos e definir limites.
          </Text>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Nome da categoria</Text>
            <TextInput
              style={ModaGlobalStyles.input}
              placeholder="Ex: Alimentação"
              placeholderTextColor="rgba(234,240,255,0.45)"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Limite (R$)</Text>
            <TextInput
              style={ModaGlobalStyles.input}
              placeholder="Ex: 800"
              placeholderTextColor="rgba(234,240,255,0.45)"
              value={limite}
              onChangeText={setLimite}
              keyboardType="numeric"
            />
          </View>

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

export default AddModal;
