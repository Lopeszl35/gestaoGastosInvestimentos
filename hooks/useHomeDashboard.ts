import { useEffect, useMemo, useState } from "react";

import { atualizarUserSaldo, getUserData } from "@/services/userServices";

export type HomeUserData = {
  saldo_atual?: number;
  perfil_financeiro?: string;
  nome?: string;
};

type UseHomeDashboardResult = {
  userData: HomeUserData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  firstName: string;
  saldoFormatado: string;
  refresh: () => Promise<void>;
  saveSaldoAtual: (saldo: number) => Promise<void>;
};

/**
 * Hook responsável por:
 * - buscar dados do usuário
 * - formatar valores para UI
 * - expor ações (refresh, salvar saldo)
 *
 * Isso evita lógica de "dados" dentro da tela, mantendo a Home focada em layout.
 */
export function useHomeDashboard(userId?: number | string): UseHomeDashboardResult {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<HomeUserData | null>(null);

  const firstName = useMemo(() => {
    const nome = (userData?.nome || "").trim();
    if (!nome) return "";
    return nome.split(" ")[0];
  }, [userData?.nome]);

  const saldoFormatado = useMemo(() => {
    const saldo = Number(userData?.saldo_atual ?? 0);
    return saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }, [userData?.saldo_atual]);

  const fetchUser = async () => {
    if (!userId) return;
    setError(null);
    setLoading(true);
    try {
      const data = await getUserData(userId);
      setUserData(data);
    } catch (e) {
      console.error("Erro ao buscar dados do usuário:", e);
      setError("Não foi possível carregar seus dados agora.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const refresh = async () => {
    try {
      setRefreshing(true);
      await fetchUser();
    } finally {
      setRefreshing(false);
    }
  };

  const saveSaldoAtual = async (saldo: number) => {
    if (!userId) return;
    await atualizarUserSaldo(saldo, userId);
    await fetchUser();
  };

  return {
    userData,
    loading,
    error,
    refreshing,
    firstName,
    saldoFormatado,
    refresh,
    saveSaldoAtual,
  };
}
