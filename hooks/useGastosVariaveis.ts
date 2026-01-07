import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getCategorias } from "@/services/categoriasService";
import { getLimiteGastoMes } from "@/services/GastosMesService";

export function useGastosVariaveis() {
  const { user } = useUser();

  const [initialLoading, setInitialLoading] = useState(true);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configuracoesGastoMes, setConfiguracoesGastoMes] = useState<any>(null);
  const [progressoMes, setProgressoMes] = useState<any>(null);
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


  const fetchCategorias = useCallback(
  async (opts?: { showOverlay?: boolean }) => {
    const showOverlay = opts?.showOverlay ?? false;

    try {
      setError(null);
      if (showOverlay) setOverlayLoading(true);

      const data = await getCategorias(user?.id_usuario);
      const idUsuario = user?.id_usuario;
 

      const categoriasArray = Array.isArray(data) ? data : [];
      console.log("categoriasArray: ", categoriasArray);
      setCategorias(categoriasArray);

      if (categoriasArray.length === 0) {
        setGastosLimiteMes(0);
        setGastosTotalMes(0);
        setError(null);
        return;
      }
      const limiteGastosMes = await getLimiteGastoMes((Number(idUsuario)), new Date().getFullYear(), new Date().getMonth() + 1);
      console.log("limiteGastosMes: ", limiteGastosMes);
      setConfiguracoesGastoMes(limiteGastosMes);
      setProgressoMes(categoriasArray[0].percentualGastoCategoriaMes);
      const limiteGastosNoMes = Number(limiteGastosMes.limite_gasto_mes) || 0;
      const gastoTotalDoMes = Number(limiteGastosMes.gasto_atual_mes) || 0;

      setGastosLimiteMes(Number.isFinite(limiteGastosNoMes) ? limiteGastosNoMes : 0);
      setGastosTotalMes(Number.isFinite(gastoTotalDoMes) ? gastoTotalDoMes : 0);
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
