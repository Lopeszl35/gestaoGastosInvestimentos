import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";

interface AddGastosModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { idCategoria: number; valor: number; descricaoCategoria: string; dataGasto: string }) => void;
    nomeCategoria: string;
    idCategoria: number
}

const AddGastosModal: React.FC<AddGastosModalProps> = ({ visible, onClose, onSave, nomeCategoria, idCategoria}) => {
    const [gastos, setGastos] = useState<string>("");
    const [dataGasto, setDataGasto] = useState<Date | null>(null);
    const [descricaoCategoria, setDescricaoCategoria] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false); // Fecha o seletor de data
        if (selectedDate) {
            setDataGasto(selectedDate); // Atualiza a data
        }
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString("pt-BR"); // Formata para "DD/MM/AAAA"
    };

    const handleSave = () => {
        if (!gastos || !dataGasto) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        onSave({
            idCategoria, // Certifique-se de que está passando o ID correto
            valor: parseFloat(gastos), // Converte para número
            descricaoCategoria,
            dataGasto: dataGasto.toISOString().split("T")[0], // Formata a data para "YYYY-MM-DD"
        });

        setGastos("");
        setDataGasto(null);
        setDescricaoCategoria("");
        onClose();
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
                    <Text style={ModaGlobalStyles.modalTitle}>Adicionar Gastos a Categoria {nomeCategoria}</Text>

                    {/* Data Picker */}
                    <View style={ModaGlobalStyles.inputContainer}>
                        <Text style={ModaGlobalStyles.inputLabel}>Data do Gasto:</Text>
                        <TouchableOpacity
                            style={ModaGlobalStyles.dateInput}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text>
                                {dataGasto ? formatDate(dataGasto) : "Selecione a data"}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={dataGasto || new Date()}
                                mode="date"
                                display={Platform.OS === "ios" ? "inline" : "default"}
                                onChange={handleDateChange}
                            />
                        )}
                    </View>

                    {/* Campo de valor gasto */}
                    <View style={ModaGlobalStyles.inputContainer}>
                        <Text style={ModaGlobalStyles.inputLabel}>Valor do Gasto:</Text>
                        <TextInput
                            style={ModaGlobalStyles.input}
                            placeholder="Valor do Gasto (R$)"
                            keyboardType="numeric"
                            value={gastos}
                            onChangeText={setGastos}
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

                    {/* Botões */}
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
};

export default AddGastosModal;
