import React, { useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";
import { homeStyles } from "../styles/homeStyles";
import { MaterialIcons } from "@expo/vector-icons";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/services/userServices";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const Home: React.FC = () => {
    const { user } = useUser();
    const [menuVisible, setMenuVisible] = React.useState(false);
    const animation = useRef(new Animated.Value(-width * 0.75)).current; // Começa fora da tela
    const [subMenuVisible, setSubMenuVisible] = React.useState(false);

    const toggleSubMenu = () => {
        setSubMenuVisible(!subMenuVisible);
    }

    const toggleMenu = () => {
        if (menuVisible) {
            // Fechar menu
            Animated.timing(animation, {
                toValue: -width * 0.75, // Desliza para fora da tela
                duration: 300, // Duração da animação (em ms)
                useNativeDriver: false,
            }).start(() => setMenuVisible(false));
        } else {
            // Abrir menu
            setMenuVisible(true);
            Animated.timing(animation, {
                toValue: 0, // Totalmente visível
                duration: 300, // Duração da animação (em ms)
                useNativeDriver: false,
            }).start();
        }
    };

    const Logout = () => {
        logoutUser();
        router.replace("/");
    }

    return (
        <ProtectedRoute>
            <View>
                {/* Barra de navegação */}
                <View style={homeStyles.navBar}>
                    {/* Botão de Menu */}
                    <TouchableOpacity onPress={toggleMenu} style={homeStyles.menuButton}>
                        <MaterialIcons name="menu" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Bem-vindo */}
                    <View style={homeStyles.welcomeContainer}>
                        <Text style={homeStyles.welcomeText}>
                            {user?.nome || 'Usuário'}
                        </Text>
                        <MaterialIcons name="person" size={20} color="white" />
                    </View>
                </View>

                {/* Overlay Transparente */}
                {menuVisible && (
                    <TouchableWithoutFeedback onPress={toggleMenu}>
                        <View style={homeStyles.menuOverlay} />
                    </TouchableWithoutFeedback>
                )}

                {/* Menu Lateral com Animação */}
                <Animated.View
                    style={[
                        homeStyles.sideMenu,
                        {
                            transform: [{ translateX: animation }],
                        },
                    ]}
                >
                    <TouchableOpacity style={homeStyles.menuItem} onPress={toggleMenu}>
                        <Text style={homeStyles.menuText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={homeStyles.menuItem}>
                        <Text style={homeStyles.menuText}>Perfil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={homeStyles.menuItem} onPress={toggleSubMenu}>
                        <Text style={subMenuVisible? homeStyles.menuTextActive : homeStyles.menuText}>Categoria Gastos</Text>
                        <MaterialIcons
                            name={subMenuVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            style={subMenuVisible? homeStyles.subMenuIconActive : ''}
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                    {subMenuVisible && (
                        <Animated.View
                            style={[
                                homeStyles.subMenu,
                                { opacity: subMenuVisible ? 1 : 0 }, // Suaviza a exibição
                            ]}
                        >
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
