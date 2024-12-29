import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { AddModalStyles } from "@/styles/AddModalStyles";

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
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={AddModalStyles.modalContainer}>
                <View style={AddModalStyles.modalContent}>
                    <Text style={AddModalStyles.modalTitle}>Adicionar Categoria</Text>
                    <TextInput
                        style={AddModalStyles.input}
                        placeholder="Nome da Categoria"
                        value={nome}
                        onChangeText={setNome}
                    />
                    <TextInput
                        style={AddModalStyles.input}
                        placeholder="Limite de Gasto (R$)"
                        keyboardType="numeric"
                        value={limite}
                        onChangeText={setLimite}
                    />
                    <TextInput
                        style={AddModalStyles.input}
                        placeholder="Descrição (opcional)"
                        value={descricao}
                        onChangeText={setDescricao}
                    />
                   <View style={AddModalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={AddModalStyles.button}
                            onPress={handleSave}
                        >
                            <Text style={AddModalStyles.buttonText}>Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={AddModalStyles.buttonCancel}
                            onPress={onClose}
                        >
                            <Text style={AddModalStyles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddModal;
