import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    RefreshControl,
} from "react-native";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AddModal from "@/components/AddModal";
import ConfigGastoMesModal from "@/components/ConfigGastoMesModal";
import ConfigGastoCategoriaModal from "@/components/ConfigGastoCategoriaModal";
import AddGastosModal from "@/components/addGastosModal";
import ConfirmDelete from "@/components/ConfirmDelete";
import { stylesGastosVariaveis } from "@/styles/GastosVariaveisStyles";
import { AlertsStyles } from "@/styles/AlertsStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { getCategorias } from "@/services/categoriasService";

const GastosVariaveis: React.FC = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [gastostotalMes, setGastosTotalMes] = useState(0);
    const [gastosLimiteMes, setGastosLimiteMes] = useState(0);
    const [alertaGastoExcedido, setAlertaGastoExcedido] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<{
        id: number;
        nome: string;
        limite: number;
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
    const [showModalAddGastos, setShowModalAddGastos] = useState(false);
    const [showCardSelect, setCardSelect] = useState(false);
    const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [updateFlag, setUpdateFlag] = useState(false);

    // Captura o mês atual
    const mes = new Date().toLocaleString("default", { month: "long" });

    
    // Função para buscar categorias
    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const data = await getCategorias(user?.id_usuario);
            console.log("id_usuario:", user?.id_usuario);
            console.log("Categorias vindas do banco: ", data);

            setCategorias(data);
            const limiteGastosMes = gastosLimiteMes || 0;
            setGastosTotalMes(data.total);

            setGastosLimiteMes(limiteGastosMes);
            setAlertaGastoExcedido(gastostotalMes > limiteGastosMes);
        } catch (error: any) {
            setError(error.message || "Erro ao buscar categorias.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect para carregar as categorias
    useEffect(() => {
        fetchCategorias();
    }, [gastosLimiteMes, updateFlag]);

    // Função para o RefreshControl
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchCategorias();
        setRefreshing(false);
    };

    if(loading) return (<View><Text>Carregando...</Text></View>);
    if (error) return (<View><Text>{error}</Text></View>);
    console.log("Categorias Definidas: ", categorias);

    const abrirMenu = (id: number) => {
        setMenuAberto(id);
        setCardSelect(true);
        setCategoriaSelecionada(categorias.find((cat) => cat.id_categoria === id));

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
        setCardSelect(false);
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

    const handleShowModalAddGastos = (idCategoria: number) => {
        setShowModalAddGastos(true);
        setCategoriaSelecionada(categorias.find((cat) => cat.id === idCategoria));
    };

    const handleSalvarCategoriaAtualizada = (
        idCategoria: number,
        nomeCategoria: string,
        limiteGastoCategoria: number,
    ) => {
        setCategorias((prevCategorias) =>
            prevCategorias.map((categoria) =>
                categoria.id === idCategoria
                    ? {
                          ...categoria,
                          nome: nomeCategoria,
                          limite: limiteGastoCategoria,
                      }
                    : categoria
            )
        );
        setUpdateFlag((prev) => !prev); // Força a reatualização
    };

    const handleSalvarGasto = (idCategoria: number, valorGasto: number, descricao: string) => {
        setCategorias((prevCategorias) =>
            prevCategorias.map((categoria) =>
                categoria.id === idCategoria
                    ? {
                          ...categoria,
                          total: categoria.total + valorGasto,
                          descricao: descricao,
                      }
                    : categoria
            )
        );
        setUpdateFlag((prev) => !prev); // Força a reatualização
    };

    const handleConfirmDelete = (idCategoria: number) => {
        setCategorias((prevCategorias) =>
            prevCategorias.filter((categoria) => categoria.id !== idCategoria)
        );
        alert("Categoria excluida com sucesso!");
        setShowModalConfirmDelete(false);
        setUpdateFlag((prev) => !prev); // Força a reatualização
    };

    return (
        <ProtectedRoute>
            <ScrollView 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
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

                {/* Modal para adicionar gastos */}
                <AddGastosModal
                    visible={showModalAddGastos}
                    onClose={() => setShowModalAddGastos(false)}
                    onSave={(data) => handleSalvarGasto(data.idCategoria, data.gastos, data.descricaoCategoria)}
                    categoria={categoriaSelecionada?.nome || ""}
                />

                {/* Modal para confirmar exclusão */}
                <ConfirmDelete 
                    visible={showModalConfirmDelete}
                    onClose={() => setShowModalConfirmDelete(false)}
                    onConfirm={() => handleConfirmDelete(categoriaSelecionada?.id || 0)}
                    message={`Tem certeza que deseja excluir a categoria ${categoriaSelecionada?.nome}?`}
                >

                </ConfirmDelete>

                {/* Título */}
                <View style={stylesGastosVariaveis.titleContainer}>
                    <Text style={stylesGastosVariaveis.title}>Resumo de Gastos Variáveis</Text>
                </View>

                {/* Cards de Resumo */}
                <View style={stylesGastosVariaveis.cardsContainer}>
                    {categorias.length === 0 && (
                        <Text style={AlertsStyles.alertText}>
                            Nenhuma categoria cadastrada.
                        </Text>
                    )}
                  {categorias.map((categoria) => {
                        const limite = parseFloat(categoria.limite || "0");
                        const total = parseFloat(categoria.total || "0");

                        return (
                            <TouchableOpacity
                                key={categoria.id_categoria}
                                style={[
                                    showCardSelect && menuAberto === categoria.id_categoria
                                        ? stylesGastosVariaveis.cardSelected
                                        : stylesGastosVariaveis.card,
                                    total > limite && stylesGastosVariaveis.cardExceeded,
                                ]}
                                onPress={() => abrirMenu(categoria.id_categoria)}
                            >
                                <Text style={stylesGastosVariaveis.cardTitle}>{categoria.nome}</Text>
                                <Text style={stylesGastosVariaveis.cardDetail}>
                                    Gastos: R$ {total.toFixed(2)}
                                </Text>
                                <Text style={stylesGastosVariaveis.cardDetail}>
                                    Limite: R$ {limite.toFixed(2)}
                                </Text>
                                {total > limite && (
                                    <Text style={stylesGastosVariaveis.cardAlert}>⚠ Gastos excedidos!</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}

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
                                <TouchableOpacity onPress={() => handleShowModalAddGastos(categoriaSelecionada.id) }>
                                    <MaterialIcons name="attach-money" size={24} color="blue" />
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
                                <TouchableOpacity onPress={() => setShowModalConfirmDelete(true)}>
                                    <MaterialIcons name="delete" size={24} color="red" />
                                </TouchableOpacity>
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
