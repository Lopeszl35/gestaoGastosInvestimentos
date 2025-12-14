import React, { useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    Dimensions,
    TouchableOpacity,
    RefreshControl
} from "react-native";
import { homeStyles } from "../styles/homeStyles";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import { PieChart, BarChart } from "react-native-chart-kit";
import { stylesGastosVariaveis } from "../styles/GastosVariaveisStyles";
import { MaterialIcons } from "@expo/vector-icons";
import ConfigSaldoAtualModal from "@/components/ConfigSaldoAtuaModal";
import { 
    atualizarUserSaldo,
    getUserData
 } from "@/services/userServices";




const { width } = Dimensions.get("window");

const Home: React.FC = () => {
    const { user } = useUser();
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [userData, setUserData] = React.useState<any>(null);
    const [showModalConfigSaldo, setShowModalConfigSaldo] = React.useState(false);

    // Dados de exemplo
    const gastosPorCategoria = [
        { name: "Alimentação", valor: 500, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        { name: "Transporte", valor: 300, color: "#36A2EB", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        { name: "Cartão", valor: 200, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    ];

    const gastosUltimosMeses = [
        { label: "Out", valor: 1500 },
        { label: "Nov", valor: 1200 },
        { label: "Dez", valor: 1800 },
    ];

    const handleConfigSaldoAtual = () => {
        setShowModalConfigSaldo(true);
    }

    const saveConfigSaldoAtual = async (saldo: number) => {
        try {
            await atualizarUserSaldo(saldo, user!.id_usuario);
            alert("Saldo atualizado com sucesso!");
            setShowModalConfigSaldo(false);

        } catch (error: any) {
            console.error("Erro ao atualizar saldo:", error.message);
            alert("Erro ao atualizar saldo: " + error.message);
        }
    }

    const fetchDadosUsuario = async () => {
        if (!user?.id_usuario) return; 
        try {
            const data = await getUserData(user.id_usuario);
            setUserData(data);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
            setError("Erro ao buscar dados do usuário.");
        }
    };

    useEffect(() => {
        if (!user?.id_usuario) return;     // espera o user existir
        fetchDadosUsuario();
    }, [user?.id_usuario]);

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await fetchDadosUsuario();
        } finally {
            setRefreshing(false);
        }
    };
    return (
        <ProtectedRoute>
            <View style={homeStyles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {handleRefresh()}}
                        />
                    }
                >
                    {/* Resumo */}
                    <View style={homeStyles.summaryBox}>
                        <Text style={homeStyles.summaryText}>Saldo Atual: R$ {userData?.saldo_atual}</Text>
                        <Text style={homeStyles.summarySubText}>Perfil Financeiro: {userData?.perfil_financeiro}</Text>
                        <View style={stylesGastosVariaveis.settingsContainer}>
                            <TouchableOpacity onPress={handleConfigSaldoAtual}>
                            <MaterialIcons
                                style={stylesGastosVariaveis.settingsIcon} 
                                name="settings" size={20} 
                                color="black"/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Gráficos */}
                    <View style={homeStyles.chartContainerPizza}>
                        <Text style={homeStyles.sectionTitle}>Gastos por Categoria</Text>
                        <PieChart
                            data={gastosPorCategoria}
                            width={width * 0.9}
                            height={150}
                            chartConfig={{
                                backgroundColor: "#1cc910",
                                backgroundGradientFrom: "#eff3ff",
                                backgroundGradientTo: "#efefef",
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor={"valor"}
                            backgroundColor={"transparent"}
                            paddingLeft={"0"}
                            absolute
                        />
                    </View>

                    <View style={homeStyles.chartContainerBarra}>
                        <Text style={homeStyles.sectionTitle}>Gastos dos Últimos Meses</Text>
                        <BarChart
                            data={{
                                labels: gastosUltimosMeses.map((item) => item.label),
                                datasets: [{ data: gastosUltimosMeses.map((item) => item.valor) }],
                            }}
                            width={width * 0.8}
                            height={190}
                            chartConfig={{
                                backgroundColor: "#022173",
                                backgroundGradientFrom: "#eff3ff",
                                backgroundGradientTo: "#efefef",
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            yAxisLabel="R$"
                            yAxisSuffix=""
                            showValuesOnTopOfBars
                        />
                    </View>

                    {/* Metas Financeiras */}
                    <View style={homeStyles.goalsContainer}>
                        <Text style={homeStyles.sectionTitle}>Metas Financeiras</Text>
                        <View style={homeStyles.goalItem}>
                            <Text style={homeStyles.goalText}>Economizar R$ 5.000</Text>
                            <Text style={homeStyles.goalProgress}>50% concluído</Text>
                        </View>
                        <View style={homeStyles.goalItem}>
                            <Text style={homeStyles.goalText}>Viagem: R$ 3.000</Text>
                            <Text style={homeStyles.goalProgress}>30% concluído</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>

            <ConfigSaldoAtualModal
                visible={showModalConfigSaldo}
                onClose={() => setShowModalConfigSaldo(false)}
                onSave={(saldo) => saveConfigSaldoAtual(saldo)}
            />
        </ProtectedRoute>
    );
};

export default Home;
