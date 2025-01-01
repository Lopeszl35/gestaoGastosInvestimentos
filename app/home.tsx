import React from "react";
import {
    View,
    ScrollView,
    Text,
    Dimensions
} from "react-native";
import { homeStyles } from "../styles/homeStyles";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import { PieChart, BarChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

const Home: React.FC = () => {
    const { user } = useUser();
    console.log("user: ", user);

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

    return (
        <ProtectedRoute>
            <View style={homeStyles.container}>
                <ScrollView>
                    {/* Resumo */}
                    <View style={homeStyles.summaryBox}>
                        <Text style={homeStyles.summaryText}>Saldo Atual: R$ {user?.saldo_atual || "0.00"}</Text>
                        <Text style={homeStyles.summarySubText}>Perfil Financeiro: {user?.perfil_financeiro || "Moderado"}</Text>
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
        </ProtectedRoute>
    );
};

export default Home;
