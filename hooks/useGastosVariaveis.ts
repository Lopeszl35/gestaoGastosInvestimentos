import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getCategorias } from "@/services/categoriasService";

export function useGastosVariaveis() {
  const { user } = useUser();

  const [initialLoading, setInitialLoading] = useState(true);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categorias, setCategorias] = useState<any[]>([]);
  const [gastostotalMes, setGastosTotalMes] = useState(0);
  const [gastosLimiteMes, setGastosLimiteMes] = useState(0);

  const mes = useMemo(
    () =>
      new Date()
        .toLocaleString("default", { month: "long" })
        .replace(/^./, (m) => m.toUpperCase()),
    []
  );

  const alertaGastoExcedido = useMemo(
    () => gastostotalMes > gastosLimiteMes && gastosLimiteMes > 0,
    [gastostotalMes, gastosLimiteMes]
  );

  const progressoMes = useMemo(() => {
    if (!gastosLimiteMes || gastosLimiteMes <= 0) return 0;
    return Math.min(gastostotalMes / gastosLimiteMes, 1);
  }, [gastostotalMes, gastosLimiteMes]);

  const fetchCategorias = useCallback(
  async (opts?: { showOverlay?: boolean }) => {
    const showOverlay = opts?.showOverlay ?? false;

    try {
      setError(null);
      if (showOverlay) setOverlayLoading(true);

      const data = await getCategorias(user?.id_usuario);
      console.log("User ID:", user?.id_usuario, "e user completo:", user);

      // ✅ garante array sempre
      const categoriasArray = Array.isArray(data) ? data : [];
      setCategorias(categoriasArray);

      // ✅ se vier vazio, NÃO é erro e não trava nada
      if (categoriasArray.length === 0) {
        setGastosLimiteMes(0);
        setGastosTotalMes(0);
        setError(null);
        return;
      }

      const limiteMes = Number(categoriasArray[0].limiteGastoMes) || 0;
      const gastoMes = Number(categoriasArray[0].gastoAtualMes) || 0;

      setGastosLimiteMes(Number.isFinite(limiteMes) ? limiteMes : 0);
      setGastosTotalMes(Number.isFinite(gastoMes) ? gastoMes : 0);
    } catch (e: any) {
      // ✅ timeout ou erro do fetch vão cair aqui
      setError(e?.message || "Erro ao buscar categorias.");
      setCategorias([]); // evita UI quebrada
    } finally {
      setInitialLoading(false);
      setOverlayLoading(false);
    }
  },
  [user?.id_usuario]
);

    // src/hooks/useGastosVariaveis.ts

    useEffect(() => {
    if (!user?.id_usuario) {
        // não trava a tela se o contexto ainda não carregou
        setInitialLoading(false);
        setCategorias([]);
        setError("Usuário não carregado. Faça login novamente.");
        return;
    }

    fetchCategorias();
    }, [user?.id_usuario, fetchCategorias]);




    useEffect(() => {
    // Watchdog: se a API não responder, a tela não pode ficar presa no loader
    const t = setTimeout(() => {
        setInitialLoading(false);
        // Se ainda não tem dados e não tem erro, assume indisponibilidade
        setError((prev) => prev ?? "Servidor indisponível ou sem resposta (timeout).");
    }, 1500); // 1.5s é suficiente pra você enxergar a tela

    return () => clearTimeout(t);
    }, []);


  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchCategorias();
    } finally {
      setRefreshing(false);
    }
  }, [fetchCategorias]);

  return {
    user,
    mes,
    categorias,
    setCategorias,

    initialLoading,
    overlayLoading,
    refreshing,
    error,

    gastostotalMes,
    gastosLimiteMes,
    alertaGastoExcedido,
    progressoMes,

    fetchCategorias,
    refresh,
  };
}
