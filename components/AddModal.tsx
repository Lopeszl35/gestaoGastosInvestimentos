import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";

interface AddModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { nome: string; limite: number; descricao: string }) => void;
}

const AddModal: React.FC<AddModalProps> = ({ visible, onClose, onSave }) => {
    const [nome, setNome] = useState("");
    const [limite, setLimite] = useState("");
    const [descricao, setDescricao] = useState("");

    const handleSave = () => {
        if (nome.trim() && limite.trim()) {
            onSave({
                nome,
                limite: parseFloat(limite),
                descricao,
            }); 
            setNome("");
            setLimite("");
            setDescricao("");
            onClose();
        } else {
            alert("Por favor, preencha todos os campos obrigatórios.");
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
                    <Text style={ModaGlobalStyles.modalTitle}>Adicionar Categoria</Text>
                    <TextInput
                        style={ModaGlobalStyles.input}
                        placeholder="Nome da Categoria"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        style={ModaGlobalStyles.input}
                        placeholder="Limite de Gasto (R$)"
                        keyboardType="numeric"
                        value={limite}
                        onChangeText={setLimite}
                    />
                    <TextInput
                        style={ModaGlobalStyles.input}
                        placeholder="Descrição (opcional)"
                        value={descricao}
                        onChangeText={setDescricao}
                    />
                    <View style={ModaGlobalStyles.buttonContainer}>
                        <TouchableOpacity onPress={handleSave} style={ModaGlobalStyles.buttonSalvar}>
                            <Text style={ModaGlobalStyles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose} style={ModaGlobalStyles.buttonCancelar}>
                            <Text style={ModaGlobalStyles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddModal;