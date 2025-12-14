import React, { useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styleNavBar } from "@/styles/NavBarStyles";
import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/services/userServices";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");


const NavBar: React.FC = () => {
    const insets = useSafeAreaInsets();

    const { user } = useUser();
    const { setUser } = useUser();
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

    const navigateAndCloseMenu = (path: string & Parameters<typeof router.push>[0]) => {
        router.push(path as any);
        Animated.timing(animation, {
            toValue: -width * 0.75,
            duration: 300,
            useNativeDriver: false,
        }).start(() => setMenuVisible(false));
    };

    const Logout = () => {
        logoutUser();
        setUser(null);
        router.replace("/");
    };

    return (
        <View>
            {/* Barra de navegação */}
            <View 
                style={[
                    styleNavBar.navBar,
                    {
                        paddingTop: Math.max(insets.top, 0),
                    },
                ]}>
                <TouchableOpacity onPress={toggleMenu} style={styleNavBar.menuButton}>
                    <MaterialIcons name="menu" size={24} color="white" />
                </TouchableOpacity>
                <View style={styleNavBar.welcomeContainer}>
                    <Text style={styleNavBar.welcomeText}>{user?.nome || "Usuário"}</Text>
                    <MaterialIcons name="person" size={20} color="white" />
                </View>
            </View>

            {/* Overlay para o menu lateral */}
            {menuVisible && (
                <TouchableWithoutFeedback onPress={toggleMenu}>
                    <View style={styleNavBar.menuOverlay} />
                </TouchableWithoutFeedback>
            )}

            {/* Menu Lateral */}
            <Animated.View
                style={[styleNavBar.sideMenu, { transform: [{ translateX: animation }] }]}
            >
                <TouchableOpacity style={styleNavBar.menuItem} onPress={() => navigateAndCloseMenu("/home")}>
                    <Text style={styleNavBar.menuText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styleNavBar.menuItem}>
                    <Text style={styleNavBar.menuText}>Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={subMenuVisible ? styleNavBar.menuItemActive : styleNavBar.menuItem} onPress={toggleSubMenu}>
                    <Text
                        style={
                            subMenuVisible
                                ? styleNavBar.menuTextActive
                                : styleNavBar.menuText
                        }
                    >
                        Categoria Gastos
                    </Text>
                    <MaterialIcons
                        name={subMenuVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        style={subMenuVisible ? styleNavBar.subMenuIconActive : ""}
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
                {subMenuVisible && (
                    <Animated.View
                        style={[styleNavBar.subMenu, { opacity: subMenuVisible ? 1 : 0 }]}
                    >
                        <TouchableOpacity style={styleNavBar.subMenuItem}>
                            <Text style={styleNavBar.subMenuText}>Gastos Fixos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styleNavBar.subMenuItem} onPress={() => navigateAndCloseMenu("/gastosVariaveis")}>
                            <Text style={styleNavBar.subMenuText}>Gastos Variáveis</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
                <TouchableOpacity style={styleNavBar.menuItem}>
                    <Text style={styleNavBar.menuText}>Configurações</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styleNavBar.menuItem} onPress={Logout}>
                    <Text style={styleNavBar.menuText}>Sair</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default NavBar;
