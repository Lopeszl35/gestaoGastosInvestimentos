import React, { useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView,
} from "react-native";
import { homeStyles } from "../styles/homeStyles";
import { MaterialIcons } from "@expo/vector-icons";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/services/userServices";
import { router } from "expo-router";
import { PieChart, BarChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

const Home: React.FC = () => {
    const { user } = useUser();
    const [menuVisible, setMenuVisible] = React.useState(false);
    const animation = useRef(new Animated.Value(-width * 0.75)).current;
    const [subMenuVisible, setSubMenuVisible] = React.useState(false);

    const toggleSubMenu = () => {
        setSubMenuVisible(!subMenuVisible);
    };

    const toggleMenu = () => {
        if (menuVisible) {
            Animated.timing(animation, {
                toValue: -width * 0.75,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setMenuVisible(false));
        } else {
            setMenuVisible(true);
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const Logout = () => {
        logoutUser();
        router.replace("/");
    };

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
                {/* Barra de navegação */}
                <View style={homeStyles.navBar}>
                    <TouchableOpacity onPress={toggleMenu} style={homeStyles.menuButton}>
                        <MaterialIcons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={homeStyles.welcomeContainer}>
                        <Text style={homeStyles.welcomeText}>{user?.nome || "Usuário"}</Text>
                        <MaterialIcons name="person" size={20} color="white" />
                    </View>
                </View>

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
                        <BarChart style={{ alignItems: "center" }}
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

                {/* Overlay Transparente */}
                {menuVisible && (
                    <TouchableWithoutFeedback onPress={toggleMenu}>
                        <View style={homeStyles.menuOverlay} />
                    </TouchableWithoutFeedback>
                )}

                {/* Menu Lateral */}
                <Animated.View style={[homeStyles.sideMenu, { transform: [{ translateX: animation }] }]}>
                    <TouchableOpacity style={homeStyles.menuItem} onPress={toggleMenu}>
                        <Text style={homeStyles.menuText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={homeStyles.menuItem}>
                        <Text style={homeStyles.menuText}>Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={homeStyles.menuItem} onPress={toggleSubMenu}>
                        <Text style={subMenuVisible ? homeStyles.menuTextActive : homeStyles.menuText}>Categoria Gastos</Text>
                        <MaterialIcons
                            name={subMenuVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            style={subMenuVisible ? homeStyles.subMenuIconActive : ""}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                    {subMenuVisible && (
                        <Animated.View style={[homeStyles.subMenu, { opacity: subMenuVisible ? 1 : 0 }]}>
                            <TouchableOpacity style={homeStyles.subMenuItem}>
                                <Text style={homeStyles.subMenuText}>Gasto Fixo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={homeStyles.subMenuItem}>
                                <Text style={homeStyles.subMenuText}>Gasto Variável</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    <TouchableOpacity style={homeStyles.menuItem} onPress={toggleMenu}>
                        <Text style={homeStyles.menuText}>Configurações</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={homeStyles.menuItem} onPress={Logout}>
                        <Text style={homeStyles.menuText}>Sair</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </ProtectedRoute>
    );
};

export default Home;
