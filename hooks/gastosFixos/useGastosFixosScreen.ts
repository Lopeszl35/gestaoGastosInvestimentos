import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import { getTelaGastosFixos } from "@/services/gastosFixosService";

export function useGastosFixosScreen() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Agora guarda o objeto REAL do backend:
  // { resumo, gastosPorCategoria, lista }
  const [data, setData] = useState<any>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const id_usuario = (user as any)?.id_usuario;
      if (!id_usuario) {
        setData(null);
        throw new Error("Usuário não autenticado.");
      }

      const payload = await getTelaGastosFixos(id_usuario);
      setData(payload);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar gastos fixos.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ✅ Dependência no user (só carrega quando existir)
  useEffect(() => {
    const id_usuario = (user as any)?.id_usuario;
    if (!id_usuario) return;
    load();
  }, [user, load]);

  return { loading, error, data, reload: load };
}
