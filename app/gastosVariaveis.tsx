import React, { useEffect, useState } from "react";
import {
    View,
    Dimensions,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScroolNav from "@/components/ScroolNav";
import AddModal from "@/components/AddModal";
import { stylesGastosVariaveis } from "@/styles/GastosVariaveisStyles";
import { MaterialIcons } from "@expo/vector-icons";

const GastosVariaveis: React.FC = () => {
    const { user } = useUser();
    const [gastostotalMes, setGastosTotalMes] = useState(0);
    const [gastosLimiteMes, setGastosLimiteMes] = useState(0);
    const [alertaGastoExcedido, setAlertaGastoExcedido] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [categorias, setCategorias] = useState<any[]>([]);

    // Mock de categorias
    useEffect(() => {
        const categoriasMock = [
            { id: 1, nome: "Mercado", total: 1200, limite: 1000, descricao: "Compras no mercado" },
            { id: 2, nome: "Uber", total: 800, limite: 900, descricao: "Gastos com transporte" },
        ];
        const totalGastos = categoriasMock.reduce((total, categoria) => total + categoria.total, 0);
        const limiteGastosMes = 3000;
        setGastosTotalMes(totalGastos);
        setGastosLimiteMes(limiteGastosMes);
        setCategorias(categoriasMock);
        if (totalGastos > limiteGastosMes) {
            setAlertaGastoExcedido(true);
        }
    }, []);

    const handleCategoriaSelecionada = (nome: string) => {
        setCategoriaSelecionada(nome);
    };

    const handleAdicionarCategoria = () => {
        setShowModal(true);
    };

    const handleSalvarCategoria = (data: { nome: string; limite: number; descricao: string }) => {
        setCategorias([
            ...categorias,
            {
                id: categorias.length + 1,
                nome: data.nome,
                total: 0,
                limite: data.limite,
                descricao: data.descricao,
            },
        ]);
    };

    return (
        <ProtectedRoute>
            <ScrollView>
                {/* Resumo */}
                <View style={stylesGastosVariaveis.summaryBox}>
                    <Text style={stylesGastosVariaveis.summaryText}>
                        Total de gastos para o mês de Dezembro: R$ {gastostotalMes || "0.00"}
                    </Text>
                    <Text style={stylesGastosVariaveis.summarySubText}>
                        Total de gastos estabelecido para esse mês: {gastosLimiteMes || "0.00"}
                    </Text>
                    {alertaGastoExcedido && (
                        <Text style={stylesGastosVariaveis.alertText}>
                            Atenção! Os gastos deste mês excederam o limite estabelecido!
                        </Text>
                    )}
                </View>

                {/* Modal para adicionar nova categoria */}
                <AddModal
                    visible={showModal}
                    onClose={() => setShowModal(false)}
                    onSave={handleSalvarCategoria}
                />

                {/* Título */}
                <View style={stylesGastosVariaveis.titleContainer}>
                    <Text style={stylesGastosVariaveis.title}>Resumo de Gastos Variáveis</Text>
                </View>

                {/* Cards de Resumo */}
                <View style={stylesGastosVariaveis.cardsContainer}>
                    {categorias.map((categoria) => (
                        <TouchableOpacity
                            key={categoria.id}
                            style={[
                                stylesGastosVariaveis.card,
                                categoria.total > categoria.limite &&
                                    stylesGastosVariaveis.cardExceeded,
                            ]}
                            onPress={() => handleCategoriaSelecionada(categoria.nome)}
                        >
                            <Text style={stylesGastosVariaveis.cardTitle}>{categoria.nome}</Text>
                            <Text style={stylesGastosVariaveis.cardDetail}>
                                Total Gasto: R$ {categoria.total.toFixed(2)}
                            </Text>
                            <Text style={stylesGastosVariaveis.cardDetail}>
                                Limite: R$ {categoria.limite.toFixed(2)}
                            </Text>
                            <Text style={stylesGastosVariaveis.cardDetail}>
                                Descrição: {categoria.descricao}
                            </Text>
                            {categoria.total > categoria.limite && (
                                <Text style={stylesGastosVariaveis.cardAlert}>⚠ Gastos excedidos!</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                    <View style={stylesGastosVariaveis.addButtonContainer}>
                        <MaterialIcons
                            style={stylesGastosVariaveis.addButton}
                            name="add-circle-outline" 
                            size={40} 
                            color="green" 
                            onPress={handleAdicionarCategoria}
                        />
                    </View>
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
};

export default GastosVariaveis;
