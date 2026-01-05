import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { ModaGlobalStyles } from "@/styles/ModaGlobalStyles";
import { getCategoriasInativas, reativarCategoria } from "@/services/categoriasService";
import { categoriasInativasModalStyles as s } from "@/styles/CategoriasInativasModalStyles";

type CategoriaInativa = {
  id_categoria: number;
  id_usuario: number;
  nome: string;
  limite: string | number;
  ativo: 0 | 1;
  inativado_em?: string | null;
};

interface Props {
  visible: boolean;
  onClose: () => void;
  idUsuario: number;
  onReativado: () => Promise<void>;
}

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDatePtBR(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

export default function CategoriasInativasModal({
  visible,
  onClose,
  idUsuario,
  onReativado,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CategoriaInativa[]>([]);
  const [reactivatingId, setReactivatingId] = useState<number | null>(null);

  const isEmpty = useMemo(() => !loading && !error && items.length === 0, [loading, error, items]);

  const fetchInativas = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getCategoriasInativas(idUsuario);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Erro ao buscar categorias inativas.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [idUsuario]);

  useEffect(() => {
    if (!visible) return;
    fetchInativas();
  }, [visible, fetchInativas]);

  const handleReativar = useCallback(
    async (id_categoria: number) => {
      try {
        setReactivatingId(id_categoria);
        await reativarCategoria(id_categoria, idUsuario);

        // Remove da lista local
        setItems((prev) => prev.filter((c) => c.id_categoria !== id_categoria));

        // Atualiza as categorias ativas na tela principal
        await onReativado();

        Alert.alert("Sucesso", "Categoria reativada com sucesso!");
      } catch (e: any) {
        Alert.alert("Erro", e?.message || "Erro ao reativar categoria.");
      } finally {
        setReactivatingId(null);
      }
    },
    [idUsuario, onReativado]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.card}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Categorias inativas</Text>
            <TouchableOpacity
              style={ModaGlobalStyles.closeButton}
              onPress={onClose}
              accessibilityLabel="Fechar modal"
            >
              <MaterialIcons name="close" size={18} color="#EAF0FF" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          {loading && (
            <View style={s.stateBox}>
              <ActivityIndicator />
              <Text style={s.stateText}>Carregando...</Text>
            </View>
          )}

          {!loading && error && (
            <View style={s.stateBox}>
              <Text style={s.errorText}>{error}</Text>
              <TouchableOpacity style={s.retryBtn} onPress={fetchInativas}>
                <Text style={s.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          )}

          {isEmpty && (
            <View style={s.stateBox}>
              <Text style={s.stateText}>Nenhuma categoria inativa.</Text>
            </View>
          )}

          {!loading && !error && items.length > 0 && (
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.id_categoria)}
              contentContainerStyle={s.listContent}
              renderItem={({ item }) => {
                const limite = Number(item.limite || 0);
                const isReactivating = reactivatingId === item.id_categoria;

                return (
                  <View style={s.itemCard}>
                    <View style={s.itemLeft}>
                      <Text style={s.itemName}>{item.nome}</Text>
                      <Text style={s.itemSub}>
                        Limite: {brl(Number.isFinite(limite) ? limite : 0)} • Inativada em:{" "}
                        {formatDatePtBR(item.inativado_em)}
                      </Text>
                    </View>

                    <TouchableOpacity
                      disabled={isReactivating}
                      onPress={() => handleReativar(item.id_categoria)}
                      style={[s.reactivateBtn, isReactivating && s.reactivateBtnDisabled]}
                    >
                      {isReactivating ? (
                        <ActivityIndicator color="#0B1220" />
                      ) : (
                        <Text style={s.reactivateText}>Reativar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
