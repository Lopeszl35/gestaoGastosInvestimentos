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
    onSave: (data: { idCategoria: number; gastos: number; dataGasto: string }) => void;
    categoria: string;
}

const AddGastosModal: React.FC<AddGastosModalProps> = ({ visible, onClose, onSave, categoria }) => {
    const [idCategoria, setIdCategoria] = useState<number>(0);
    const [gastos, setGastos] = useState<number>(0);
    const [dataGasto, setDataGasto] = useState<Date | null>(null);
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
        if (dataGasto) {
            onSave({ idCategoria, gastos, dataGasto: formatDate(dataGasto) });
        } else {
            alert("Por favor, selecione uma data para o gasto.");
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
                    <Text style={ModaGlobalStyles.modalTitle}>Adicionar Gastos a Categoria {categoria}</Text>

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
                            value={gastos.toString()}
                            onChangeText={(text) => setGastos(parseInt(text))}
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
