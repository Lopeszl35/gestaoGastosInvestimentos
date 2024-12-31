import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
} from "react-native";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";

interface ConfigGastoCategoriaModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (
        idCategoria: number,
        nomeCategoria: string,
        limiteGastoCategoria: number,
        descricaoCategoria: string
    ) => void;
    categoria: {
        id: number;
        nome: string;
        limite: number;
        descricao: string;
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
    const [descricaoCategoria, setDescricaoCategoria] = useState("");

    // Preenche os campos com os dados da categoria selecionada quando o modal é aberto
    useEffect(() => {
        if (categoria) {
            setNomeCategoria(categoria.nome);
            setLimiteGastoCategoria(categoria.limite.toString());
            setDescricaoCategoria(categoria.descricao || "");
        }
    }, [categoria]);

    const handleSave = () => {
        if (nomeCategoria.trim() && limiteGastoCategoria.trim()) {
            onSave(
                categoria?.id || 0,
                nomeCategoria,
                parseFloat(limiteGastoCategoria),
                descricaoCategoria
            );
            onClose(); // Fecha o modal após salvar
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
                    <Text style={ModaGlobalStyles.modalTitle}>Atualizar Categoria</Text>
                    <View style={ModaGlobalStyles.inputContainer}>
                    <Text style={ModaGlobalStyles.inputLabel}> Nome Categoria</Text>
                        <TextInput
                            style={ModaGlobalStyles.input}
                            placeholder="Nome da Categoria"
                            value={nomeCategoria}
                            onChangeText={setNomeCategoria}
                        />
                    </View>
                    <View style={ModaGlobalStyles.inputContainer}>
                        <Text style={ModaGlobalStyles.inputLabel}> Limite de Gasto</Text>
                        <TextInput
                            style={ModaGlobalStyles.input}
                            placeholder="Limite de Gasto (R$)"
                            keyboardType="numeric"
                            value={limiteGastoCategoria}
                            onChangeText={setLimiteGastoCategoria}
                        />
                    </View>
                    <View style={ModaGlobalStyles.inputContainer}>
                        <Text style={ModaGlobalStyles.inputLabel}> Descrição</Text>
                        <TextInput
                            style={ModaGlobalStyles.input}
                            placeholder="Descrição (opcional)"
                            value={descricaoCategoria}
                            onChangeText={setDescricaoCategoria}
                        />
                    </View>
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

export default ConfigGastoCategoriaModal;
