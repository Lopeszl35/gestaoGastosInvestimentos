import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import { getUserData } from "@/services/userServices";

import HomeHeader from "@/components/home/HomeHeader";
import StatCardsRow from "@/components/home/StatCardsRow";
import QuickActions from "@/components/home/QuickActions";
import MonthlySummaryCard from "@/components/home/MonthlySummaryCard";
import RecentTransactions from "@/components/home/RecentTransactions";

import { homeStyles } from "../styles/homeStyles";

const { width } = Dimensions.get("window");

type UserData = {
  saldo_atual?: number;
  perfil_financeiro?: string;
  nome?: string;
};

const Home: React.FC = () => {
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showModalConfigSaldo, setShowModalConfigSaldo] = useState(false);

  // Mock (até integrar com seu módulo real)
  const stats = useMemo(
    () => ({
      saldoTotal: Number(userData?.saldo_atual ?? 0),
      receitasMes: 5120.75,
      despesasMes: 2340.4,
      investimentos: 25000,
      deltaSaldo: 12.5,
      deltaReceitas: 8.2,
      deltaDespesas: 3.1,
      deltaInvest: 15.8,
    }),
    [userData?.saldo_atual]
  );

  const recentTransactions = useMemo(
    () => [
      {
        id: "1",
        title: "Salário",
        category: "Trabalho • 27 de dez.",
        amount: 5000,
        type: "in" as const,
      },
      {
        id: "2",
        title: "Supermercado",
        category: "Alimentação • 26 de dez.",
        amount: 350.5,
        type: "out" as const,
      },
      {
        id: "3",
        title: "Dividendos PETR4",
        category: "Investimentos • 25 de dez.",
        amount: 120.75,
        type: "in" as const,
      },
      {
        id: "4",
        title: "Netflix",
        category: "Streaming • 24 de dez.",
        amount: 55.9,
        type: "out" as const,
      },
    ],
    []
  );

  const firstName = useMemo(() => {
    const nome = (userData?.nome || "").trim();
    if (!nome) return "";
    return nome.split(" ")[0];
  }, [userData?.nome]);

  const saldoFormatado = useMemo(() => {
    const saldo = Number(userData?.saldo_atual ?? 0);
    return saldo.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }, [userData?.saldo_atual]);

  const fetchDadosUsuario = async () => {
    if (!user?.id_usuario) return;
    setError(null);
    setLoading(true);
    try {
      const data = await getUserData(user.id_usuario);
      setUserData(data);
    } catch (e) {
      console.error("Erro ao buscar dados do usuário:", e);
      setError("Não foi possível carregar seus dados agora.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id_usuario) return;
    fetchDadosUsuario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          contentContainerStyle={homeStyles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader
            firstName={firstName}
            perfil={userData?.perfil_financeiro || "Perfil"}
            onSearchPress={() => alert("Em breve: busca global")}
            onBellPress={() => alert("Em breve: notificações")}
          />

          {!!error && <Text style={homeStyles.errorText}>{error}</Text>}

          <StatCardsRow
            stats={[
              {
                title: "Saldo Total",
                value: saldoFormatado,
                delta: stats.deltaSaldo,
                variant: "success",
              },
              {
                title: "Receitas do Mês",
                value: stats.receitasMes,
                delta: stats.deltaReceitas,
                variant: "success",
              },
              {
                title: "Despesas do Mês",
                value: stats.despesasMes,
                delta: stats.deltaDespesas,
                variant: "danger",
              },
              {
                title: "Investimentos",
                value: stats.investimentos,
                delta: stats.deltaInvest,
                variant: "info",
              },
            ]}
          />

          <View style={homeStyles.grid2Cols}>
            <MonthlySummaryCard
              monthLabel="dezembro de 2025"
              saldoMes={2780.35}
              receitas={stats.receitasMes}
              despesas={stats.despesasMes}
              usoOrcamentoPercent={46}
            />

            <QuickActions
              actions={[
                {
                  id: "add-in",
                  title: "Nova Receita",
                  subtitle: "Adicionar entrada",
                  icon: "trending-up",
                  variant: "success",
                  onPress: () => alert("Em breve: nova receita"),
                },
                {
                  id: "add-out",
                  title: "Nova Despesa",
                  subtitle: "Registrar gasto",
                  icon: "trending-down",
                  variant: "danger",
                  onPress: () => router.push("/gastosVariaveis"),
                },
                {
                  id: "invest",
                  title: "Investir",
                  subtitle: "Aplicar dinheiro",
                  icon: "show-chart",
                  variant: "info",
                  onPress: () => alert("Em breve: investir"),
                },
                {
                  id: "goal",
                  title: "Nova Meta",
                  subtitle: "Definir objetivo",
                  icon: "flag",
                  variant: "warning",
                  onPress: () => alert("Em breve: metas"),
                },
              ]}
            />
          </View>

          <RecentTransactions
            title="Transações Recentes"
            subtitle="Últimos 7 dias"
            items={recentTransactions}
            onPressSeeMore={() => alert("Em breve: todas transações")}
          />

          <View style={{ height: 18 }} />
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
};

export default Home;
