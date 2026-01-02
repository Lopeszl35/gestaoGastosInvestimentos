import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getGastosFixosData } from "@/services/gastosFixosService";

export function useGastosFixosScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const id_usuario = (user as any)?.id_usuario;
      if (!id_usuario) throw new Error("Usuário não autenticado.");

      const dto = await getGastosFixosData(id_usuario);
      setData(dto);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao carregar gastos fixos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { loading, error, data, reload: load };
}
