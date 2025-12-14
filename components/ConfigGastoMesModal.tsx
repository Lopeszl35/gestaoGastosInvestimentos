import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
} from "react-native";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";

interface ConfigGastoMesModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { limiteGastoMes: number; mes: string, ano: number }) => void;
}

const ConfigGastoMesModal: React.FC<ConfigGastoMesModalProps> = ({
    visible,
    onClose,
    onSave,
}) => {
    const [limiteGastoMes, setLimiteGastoMes] = useState<string>("");
    const mes = new Date().toLocaleString("default", { month: "long" });
    const ano = new Date().getFullYear();

    const handleSave = () => {
        if (limiteGastoMes.trim()) {
            onSave({ limiteGastoMes: parseFloat(limiteGastoMes), mes, ano });
            setLimiteGastoMes("");
            onClose();
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={ModaGlobalStyles.modalContainer}>
                <View style={ModaGlobalStyles.modalContent}>
                    <Text style={ModaGlobalStyles.modalTitle}>
                        Configurar Limite de Gastos para {mes} de {ano}
                    </Text>
                    <TextInput
                        style={ModaGlobalStyles.input}
                        placeholder="Insira o limite de gastos (R$)"
                        keyboardType="numeric"
                        value={limiteGastoMes}
                        onChangeText={setLimiteGastoMes}
                    />
                    <View style={ModaGlobalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={ModaGlobalStyles.buttonSucess}
                            onPress={handleSave}
                        >
                            <Text style={ModaGlobalStyles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={ModaGlobalStyles.buttonCancelar}
                            onPress={onClose}
                        >
                            <Text style={ModaGlobalStyles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfigGastoMesModal;
