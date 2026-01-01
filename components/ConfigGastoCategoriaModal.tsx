import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";

interface ConfigGastoCategoriaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    idCategoria: number,
    nomeCategoria: string,
    limiteGastoCategoria: number
  ) => void;
  categoria: {
    id_categoria: number;
    nome: string;
    limite: number;
  } | null;
}

/**
 * 📍 Arquivo: components/ConfigGastoCategoriaModal.tsx
 * Modal para editar nome/limite de uma categoria.
 * Mantém validações e callbacks; moderniza o layout para o padrão premium/dark.
 */
const ConfigGastoCategoriaModal: React.FC<ConfigGastoCategoriaModalProps> = ({
  visible,
  onClose,
  onSave,
  categoria,
}) => {
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [limiteGastoCategoria, setLimiteGastoCategoria] = useState("");

  useEffect(() => {
    if (categoria) {
      setNomeCategoria(categoria.nome ?? "");
      setLimiteGastoCategoria(String(categoria.limite ?? ""));
    }
  }, [categoria]);

  const canSave = useMemo(
    () =>
      nomeCategoria.trim().length > 0 && limiteGastoCategoria.trim().length > 0,
    [nomeCategoria, limiteGastoCategoria]
  );

  const handleSave = () => {
    if (!categoria) {
      Alert.alert("Erro", "Categoria não encontrada.");
      return;
    }

    if (!nomeCategoria.trim()) {
      Alert.alert("Erro", "O nome da categoria não pode estar vazio.");
      return;
    }

    const limite = parseFloat(limiteGastoCategoria);
    if (isNaN(limite) || limite <= 0) {
      Alert.alert("Erro", "Por favor, insira um limite válido.");
      return;
    }

    onSave(categoria.id_categoria, nomeCategoria.trim(), limite);
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
            <Text style={ModaGlobalStyles.modalTitle}>Editar categoria</Text>
            <TouchableOpacity
              style={ModaGlobalStyles.closeButton}
              onPress={onClose}
              accessibilityLabel="Fechar modal"
            >
              <MaterialIcons name="close" size={18} color="#EAF0FF" />
            </TouchableOpacity>
          </View>

          <Text style={ModaGlobalStyles.modalMessage}>
            Ajuste o nome e o limite. Isso ajuda você a manter o controle do
            mês.
          </Text>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Nome</Text>
            <TextInput
              style={ModaGlobalStyles.input}
              placeholder="Ex: Lazer"
              placeholderTextColor="rgba(234,240,255,0.45)"
              value={nomeCategoria}
              onChangeText={setNomeCategoria}
            />
          </View>

          <View style={ModaGlobalStyles.inputContainer}>
            <Text style={ModaGlobalStyles.inputLabel}>Limite (R$)</Text>
            <TextInput
              style={ModaGlobalStyles.input}
              placeholder="Ex: 300"
              placeholderTextColor="rgba(234,240,255,0.45)"
              value={limiteGastoCategoria}
              onChangeText={setLimiteGastoCategoria}
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

export default ConfigGastoCategoriaModal;
