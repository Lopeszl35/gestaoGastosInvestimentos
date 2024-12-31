import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";


interface ConfirmDeleteProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({ visible, onClose, onConfirm, message }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={ModaGlobalStyles.modalContainer}>
                <View style={ModaGlobalStyles.modalContent}>
                    <Text style={ModaGlobalStyles.modalTitle}>Confirmar Exclusão</Text>
                    <Text style={ModaGlobalStyles.modalMessage}>{message}</Text>
                    <View style={ModaGlobalStyles.buttonContainer}>
                        <TouchableOpacity style={ModaGlobalStyles.buttonSucess} onPress={onConfirm}>
                            <Text style={ModaGlobalStyles.buttonText}>Confirmar</Text>
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

export default ConfirmDelete;