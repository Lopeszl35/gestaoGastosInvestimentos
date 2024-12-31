import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Dimensions,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
} from "react-native";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AddModal from "@/components/AddModal";
import ConfigGastoMesModal from "@/components/ConfigGastoMesModal";
import ConfigGastoCategoriaModal from "@/components/ConfigGastoCategoriaModal";
import { stylesGastosVariaveis } from "@/styles/GastosVariaveisStyles";
import { MaterialIcons } from "@expo/vector-icons";

const GastosVariaveis: React.FC = () => {
    const { user } = useUser();
    const [gastostotalMes, setGastosTotalMes] = useState(0);
    const [gastosLimiteMes, setGastosLimiteMes] = useState(0);
    const [alertaGastoExcedido, setAlertaGastoExcedido] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<{
        id: number;
        nome: string;
        limite: number;
        descricao: string;
    } | null>(null);
    const [menuAberto, setMenuAberto] = useState<number | null>(null);
    const animationRefs = [
        useRef(new Animated.Value(0)),
        useRef(new Animated.Value(0)),
        useRef(new Animated.Value(0)),
    ];
    const [showModalAddCategoria, setShowModalAddCategoria] = useState(false);
    const [showModalConfigGastoMes, setShowModalConfigGastoMes] = useState(false);
    const [showModalConfigCategoria, setShowModalConfigCategoria] = useState(false);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [updateFlag, setUpdateFlag] = useState(false);

    // Captura o mês atual
    const mes = new Date().toLocaleString("default", { month: "long" });

    // Mock de categorias
    useEffect(() => {
        const categoriasMock = [
            { id: 1, nome: "Mercado", total: 1200, limite: 1000, descricao: "Compras no mercado" },
            { id: 2, nome: "Uber", total: 800, limite: 900, descricao: "Gastos com transporte" },
        ];
        const totalGastos = categoriasMock.reduce((total, categoria) => total + categoria.total, 0);
        const limiteGastosMes = gastosLimiteMes || 0;
        setGastosTotalMes(totalGastos);
        setGastosLimiteMes(limiteGastosMes);
        setCategorias(categoriasMock);
        setAlertaGastoExcedido(totalGastos > limiteGastosMes);
    }, [gastosLimiteMes, updateFlag]);

    const abrirMenu = (id: number) => {
        setMenuAberto(id);
        setCategoriaSelecionada(categorias.find((cat) => cat.id === id));

        // Iniciar animações para cada ícone na roda
        Animated.stagger(100, [
            Animated.timing(animationRefs[0].current, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(animationRefs[1].current, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(animationRefs[2].current, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const fecharMenu = () => {
        Animated.stagger(100, [
            Animated.timing(animationRefs[0].current, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(animationRefs[1].current, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(animationRefs[2].current, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => setMenuAberto(null));
    };

    const handleCategoriaSelecionada = (id: number) => {
        const categoria = categorias.find((cat) => cat.id === id) || null;
        setCategoriaSelecionada(categoria);
        setShowModalConfigCategoria(true); // Abre o modal
    };

    const handleAdicionarCategoria = () => {
        setShowModalAddCategoria(true);
    };

    const handleConfigGastoMes = () => {
        setShowModalConfigGastoMes(true);
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

    const handleSalvarCategoriaAtualizada = (
        idCategoria: number,
        nomeCategoria: string,
        limiteGastoCategoria: number,
        descricaoCategoria: string
    ) => {
        setCategorias((prevCategorias) =>
            prevCategorias.map((categoria) =>
                categoria.id === idCategoria
                    ? {
                          ...categoria,
                          nome: nomeCategoria,
                          limite: limiteGastoCategoria,
                          descricao: descricaoCategoria,
                      }
                    : categoria
            )
        );
        setUpdateFlag((prev) => !prev); // Força a reatualização
    };

    return (
        <ProtectedRoute>
            <ScrollView>
                {/* Resumo */}
                <View style={stylesGastosVariaveis.summaryBox}>
                    <Text style={stylesGastosVariaveis.summaryText}>
                        No mês de {mes}, você já gastou R$ {gastostotalMes || "0.00"}
                    </Text>
                    <Text style={stylesGastosVariaveis.summarySubText}>
                        Total de gastos estabelecido para esse mês: {gastosLimiteMes || "0.00"}
                    </Text>
                    {alertaGastoExcedido && (
                        <Text style={stylesGastosVariaveis.alertText}>
                            Atenção! Os gastos deste mês excederam o limite estabelecido!
                        </Text>
                    )}
                    <View style={stylesGastosVariaveis.settingsContainer}>
                        <TouchableOpacity
                            onPress={handleConfigGastoMes}
                            style={stylesGastosVariaveis.settingsIcon}
                        >
                            <MaterialIcons name="settings" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Modal para adicionar nova categoria */}
                <AddModal
                    visible={showModalAddCategoria}
                    onClose={() => setShowModalAddCategoria(false)}
                    onSave={handleSalvarCategoria}
                />

                {/* Modal para configurar o gasto do mês */}
                <ConfigGastoMesModal
                    visible={showModalConfigGastoMes}
                    onClose={() => setShowModalConfigGastoMes(false)}
                    onSave={(gastoMes: number) => setGastosLimiteMes(gastoMes)}
                />

                {/*Modal para configurar categoria */}
                <ConfigGastoCategoriaModal
                    visible={showModalConfigCategoria}
                    onClose={() => setShowModalConfigCategoria(false)}
                    onSave={handleSalvarCategoriaAtualizada}
                    categoria={categoriaSelecionada}
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
                            onPress={() => abrirMenu(categoria.id)}
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
                    {menuAberto && categoriaSelecionada && (
                        <View style={stylesGastosVariaveis.overlay}>
                            <Animated.View
                                style={[
                                    stylesGastosVariaveis.optionIcon,
                                    {
                                        transform: [
                                            {
                                                translateX: animationRefs[0].current.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, -50],
                                                }),
                                            },
                                            {
                                                translateY: animationRefs[0].current.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, -50],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >   <TouchableOpacity onPress={() => handleCategoriaSelecionada(categoriaSelecionada.id)}>
                                    <MaterialIcons name="edit" size={24} color="green" />
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View
                                style={[
                                    stylesGastosVariaveis.optionIcon,
                                    {
                                        transform: [
                                            {
                                                translateX: animationRefs[1].current.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, 50],
                                                }),
                                            },
                                            {
                                                translateY: animationRefs[1].current.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, -50],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <MaterialIcons name="attach-money" size={24} color="blue" />
                            </Animated.View>
                            <Animated.View
                                style={[
                                    stylesGastosVariaveis.optionIcon,
                                    {
                                        transform: [
                                            {
                                                translateX: animationRefs[2].current.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, 0],
                                                }),
                                            },
                                            {
                                                translateY: animationRefs[2].current.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, -15],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >   <TouchableOpacity onPress={() => fecharMenu()}>
                                    <MaterialIcons name="close" size={24} color="red" />
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View
                                style={[
                                    stylesGastosVariaveis.optionIcon,
                                    {
                                        transform: [
                                            {
                                                translateX: animationRefs[2].current.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, 0],
                                                }),
                                            },
                                            {
                                                translateY: animationRefs[2].current.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0, 50],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <MaterialIcons name="delete" size={24} color="red" />
                            </Animated.View>
                        </View>
                    )}
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
