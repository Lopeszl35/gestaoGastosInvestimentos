import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (saldo: number) => void;
};

export default function ConfigSaldoAtualModal({ visible, onClose, onSave }: Props) {
  const [saldoAtual, setSaldoAtual] = useState("");

  const handleSave = () => {
    const valor = Number(String(saldoAtual).replace(",", "."));
    if (Number.isNaN(valor)) return;
    onSave(valor);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={ModaGlobalStyles.modalContainer}>
        <View style={ModaGlobalStyles.modalContent}>
          <Text style={ModaGlobalStyles.modalTitle}>Configurar Saldo Atual</Text>

          <TextInput
            style={ModaGlobalStyles.input}
            placeholder="Insira o saldo atual"
            value={saldoAtual}
            onChangeText={setSaldoAtual}
            keyboardType="numeric"
          />
        <View style={ModaGlobalStyles.buttonContainer}>
          <TouchableOpacity style={ModaGlobalStyles.buttonSucess} onPress={handleSave}>
            <Text style={ModaGlobalStyles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={ModaGlobalStyles.buttonCancelar} onPress={onClose}>
            <Text style={ModaGlobalStyles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        </View>
      </View>
    </Modal>
  );
}
