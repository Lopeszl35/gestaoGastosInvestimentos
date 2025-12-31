import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { styleNavBar } from "@/styles/NavBarStyles";
import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/services/userServices";

const { width, height } = Dimensions.get("window");
const MENU_WIDTH = Math.min(width * 0.82, 320); // responsivo: mobile pequeno/grande

const NavBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user, setUser } = useUser();

  const [menuVisible, setMenuVisible] = useState(false);
  const [subMenuVisible, setSubMenuVisible] = useState(false);

  // Drawer começa escondido à esquerda
  const animation = useRef(new Animated.Value(-MENU_WIDTH)).current;

  const displayName = useMemo(() => user?.nome || "Usuário", [user?.nome]);
  const displayEmail = useMemo(
    () => (user as any)?.email || "usuario@email.com",
    [user]
  );

  const toggleSubMenu = () => setSubMenuVisible((prev) => !prev);

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(animation, {
      toValue: 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(animation, {
      toValue: -MENU_WIDTH,
      duration: 240,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const toggleMenu = () => (menuVisible ? closeMenu() : openMenu());

  const navigateAndCloseMenu = (path: string) => {
    router.push(path as any);
    closeMenu();
  };

  const Logout = () => {
    logoutUser();
    setUser(null);
    router.replace("/");
  };

  return (
    <View>
      {/* TOP NAVBAR (dark + gradient) */}
      <LinearGradient
        colors={["#0B1220", "#0C1730", "#0B1220"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styleNavBar.navBar, { paddingTop: Math.max(insets.top, 0) }]}
      >
        <TouchableOpacity
          onPress={toggleMenu}
          style={styleNavBar.iconButton}
          accessibilityLabel="Abrir menu"
          pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}
        >
          <MaterialIcons name="menu" size={22} color="#EAF0FF" />
        </TouchableOpacity>

        <View style={styleNavBar.navTitleWrap}>
          <Text style={styleNavBar.navTitle}>FinanceApp</Text>
          <Text style={styleNavBar.navSubtitle}>Gestão inteligente</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigateAndCloseMenu("/home")}
          style={styleNavBar.profilePill}
          accessibilityLabel="Perfil"
          pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}
        >
          <View style={styleNavBar.avatarCircle}>
            <Text style={styleNavBar.avatarText}>
              {displayName?.trim()?.[0]?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styleNavBar.profileName} numberOfLines={1}>
            {displayName}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* OVERLAY */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styleNavBar.menuOverlay} />
        </TouchableWithoutFeedback>
      )}

      {/* SIDE MENU */}
      {menuVisible && (
        <Animated.View
          style={[
            styleNavBar.sideMenu,
            {
              height,
              width: MENU_WIDTH,
              paddingTop: Math.max(insets.top, 0),
              transform: [{ translateX: animation }],
            },
          ]}
        >
          {/* Header do menu */}
          <View style={styleNavBar.sideHeader}>
            <View style={styleNavBar.sideHeaderRow}>
              <View style={styleNavBar.sideAvatar}>
                <Text style={styleNavBar.sideAvatarText}>
                  {displayName?.trim()?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styleNavBar.sideName} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={styleNavBar.sideEmail} numberOfLines={1}>
                  {displayEmail}
                </Text>
              </View>
            </View>
          </View>

          {/* SECTION: MENU PRINCIPAL */}
          <Text style={styleNavBar.sectionLabel}>MENU PRINCIPAL</Text>

          <TouchableOpacity
            style={styleNavBar.menuItem}
            onPress={() => navigateAndCloseMenu("/home")}
          >
            <MaterialIcons name="dashboard" size={20} color="#EAF0FF" />
            <Text style={styleNavBar.menuText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styleNavBar.menuItem}
            onPress={() => alert("Em breve: Perfil")}
          >
            <MaterialIcons name="person" size={20} color="#EAF0FF" />
            <Text style={styleNavBar.menuText}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={
              subMenuVisible ? styleNavBar.menuItemActive : styleNavBar.menuItem
            }
            onPress={toggleSubMenu}
          >
            <MaterialIcons name="category" size={20} color="#EAF0FF" />
            <Text
              style={
                subMenuVisible
                  ? styleNavBar.menuTextActive
                  : styleNavBar.menuText
              }
            >
              Categoria Gastos
            </Text>
            <View style={{ flex: 1 }} />
            <MaterialIcons
              name={
                subMenuVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={22}
              color="#EAF0FF"
            />
          </TouchableOpacity>

          {subMenuVisible && (
            <View style={styleNavBar.subMenu}>
              <TouchableOpacity
                style={styleNavBar.subMenuItem}
                onPress={() => navigateAndCloseMenu("/gastosFixos")}
              >
                <MaterialIcons
                  name="check-circle-outline"
                  size={18}
                  color="rgba(234,240,255,0.75)"
                />
                <Text style={styleNavBar.subMenuText}>Gastos Fixos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styleNavBar.subMenuItem}
                onPress={() => navigateAndCloseMenu("/gastosVariaveis")}
              >
                <MaterialIcons
                  name="receipt-long"
                  size={18}
                  color="rgba(234,240,255,0.75)"
                />
                <Text style={styleNavBar.subMenuText}>Gastos Variáveis</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* SECTION: SUPORTE */}
          <Text style={styleNavBar.sectionLabel}>SUPORTE</Text>

          <TouchableOpacity
            style={styleNavBar.menuItem}
            onPress={() => alert("Em breve: Configurações")}
          >
            <MaterialIcons name="settings" size={20} color="#EAF0FF" />
            <Text style={styleNavBar.menuText}>Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styleNavBar.menuItemDanger} onPress={Logout}>
            <MaterialIcons name="logout" size={20} color="#F87171" />
            <Text style={styleNavBar.menuTextDanger}>Sair</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styleNavBar.footer}>
            <Text style={styleNavBar.footerText}>
              v1.0 • Gestão Inteligente
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default NavBar;
