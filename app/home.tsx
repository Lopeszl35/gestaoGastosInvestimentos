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

const { width } = Dimensions.get("window");

const Home: React.FC = () => {
    const [menuVisible, setMenuVisible] = React.useState(false);
    const animation = useRef(new Animated.Value(-width * 0.75)).current; // Começa fora da tela

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

    const mockUser = {
        id: 1,
        name: "John Doe",
        email: "t0ZQ2@example.com",
    };

    return (
        <View>
            {/* Barra de navegação */}
            <View style={homeStyles.navBar}>
                {/* Botão de Menu */}
                <TouchableOpacity onPress={toggleMenu} style={homeStyles.menuContainer}>
                    <MaterialIcons name="menu" size={24} color="white" />
                </TouchableOpacity>

                {/* Bem-vindo */}
                <View style={homeStyles.welcomeContainer}>
                    <Text style={homeStyles.welcomeText}>
                        Bem-vindo, {mockUser.name}
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
                        transform: [{ translateX: animation }], // Animação suave do menu
                    },
                ]}
            >
                <TouchableOpacity style={homeStyles.menuItem} onPress={toggleMenu}>
                    <Text style={homeStyles.menuText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.menuItem} onPress={toggleMenu}>
                    <Text style={homeStyles.menuText}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.menuItem} onPress={toggleMenu}>
                    <Text style={homeStyles.menuText}>Configurações</Text>
                </TouchableOpacity>
                <TouchableOpacity style={homeStyles.menuItem} onPress={toggleMenu}>
                    <Text style={homeStyles.menuText}>Sair</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default Home;
