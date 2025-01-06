import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    Alert,
} from "react-native";
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
        id_categoria: number; // Corrigido para refletir a propriedade esperada
        nome: string;
        limite: number;
    } | null; // Dados da categoria selecionada ou null
}

const ConfigGastoCategoriaModal: React.FC<ConfigGastoCategoriaModalProps> = ({
    visible,
    onClose,
    onSave,
    categoria,
}) => {
    const [nomeCategoria, setNomeCategoria] = useState("");
    const [limiteGastoCategoria, setLimiteGastoCategoria] = useState("");

    // Preenche os campos com os dados da categoria selecionada quando o modal é aberto
    useEffect(() => {
        if (categoria) {
            setNomeCategoria(categoria.nome || "");
            setLimiteGastoCategoria(categoria.limite.toString() || "");
        } else {
            setNomeCategoria("");
            setLimiteGastoCategoria("");
        }
    }, [categoria]);

    const handleSave = () => {
        if (!nomeCategoria.trim()) {
            Alert.alert("Erro", "O nome da categoria não pode estar vazio.");
            return;
        }

        const limite = parseFloat(limiteGastoCategoria);
        if (isNaN(limite) || limite <= 0) {
            Alert.alert("Erro", "Por favor, insira um limite válido.");
            return;
        }

        onSave(categoria!.id_categoria, nomeCategoria, limite);
        onClose(); // Fecha o modal após salvar
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
                        Atualizar Categoria
                    </Text>
                    <View style={ModaGlobalStyles.inputContainer}>
                        <Text style={ModaGlobalStyles.inputLabel}>
                            Nome da Categoria
                        </Text>
                        <TextInput
                            style={ModaGlobalStyles.input}
                            placeholder="Nome da Categoria"
                            value={nomeCategoria}
                            onChangeText={setNomeCategoria}
                        />
                    </View>
                    <View style={ModaGlobalStyles.inputContainer}>
                        <Text style={ModaGlobalStyles.inputLabel}>
                            Limite de Gasto (R$)
                        </Text>
                        <TextInput
                            style={ModaGlobalStyles.input}
                            placeholder="Limite de Gasto (R$)"
                            keyboardType="numeric"
                            value={limiteGastoCategoria}
                            onChangeText={setLimiteGastoCategoria}
                        />
                    </View>
                    <View style={ModaGlobalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                ModaGlobalStyles.buttonSucess,
                                (!nomeCategoria.trim() || !limiteGastoCategoria.trim()) &&
                                    ModaGlobalStyles.buttonDisabled,
                            ]}
                            onPress={handleSave}
                            disabled={!nomeCategoria.trim() || !limiteGastoCategoria.trim()}
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

export default ConfigGastoCategoriaModal;
