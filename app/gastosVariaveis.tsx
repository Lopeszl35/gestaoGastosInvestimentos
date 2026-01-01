import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ProtectedRoute from "@/components/ProtectedRoute";
import FullScreenLoader from "@/components/FullScreenLoader";
import LoadingOverlay from "@/components/LoadingOverlay";
import AddModal from "@/components/AddModal";
import ConfigGastoMesModal from "@/components/ConfigGastoMesModal";
import ConfigGastoCategoriaModal from "@/components/ConfigGastoCategoriaModal";
import AddGastosModal from "@/components/addGastosModal";
import ConfirmDelete from "@/components/ConfirmDelete";
import { gvStyles } from "@/styles/GastosVariaveisStyles";
import { useGastosVariaveis } from "@/hooks/useGastosVariaveis";

import {
  createCategoria,
  deleteCategoria,
  addGasto,
  updateCategoria,
} from "@/services/categoriasService";
import { configLimiteGastoMes } from "@/services/GastosMesService";

const GastosVariaveis: React.FC = () => {
  const {
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
  } = useGastosVariaveis();

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<any | null>(
    null
  );

  const [showModalAddCategoria, setShowModalAddCategoria] = useState(false);
  const [showModalConfigGastoMes, setShowModalConfigGastoMes] = useState(false);
  const [showModalConfigCategoria, setShowModalConfigCategoria] =
    useState(false);
  const [showModalAddGastos, setShowModalAddGastos] = useState(false);
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);

  const saldoMesText = useMemo(
    () =>
      `No mês de ${mes}, você já gastou R$ ${Number(
        gastostotalMes || 0
      ).toFixed(2)}`,
    [mes, gastostotalMes]
  );

  if (initialLoading) {
    return <FullScreenLoader text="Preparando seus dados financeiros..." />;
  }

  const handleSalvarGastoMes = async (data: {
    limiteGastoMes: number;
    mes: string;
    ano: number;
  }) => {
    try {
      await configLimiteGastoMes(user!.id_usuario, data);
      setShowModalConfigGastoMes(false);
      await fetchCategorias({ showOverlay: true });
      alert("Limite de gastos atualizado com sucesso!");
    } catch (e: any) {
      alert(e?.message || "Erro ao atualizar limite.");
    }
  };

  const handleSalvarCategoria = async (data: {
    nome: string;
    limite: number;
  }) => {
    try {
      const novaCategoria = {
        id_usuario: user?.id_usuario,
        nome: data.nome,
        limite: data.limite,
      };
      await createCategoria(novaCategoria);
      setShowModalAddCategoria(false);
      await fetchCategorias({ showOverlay: true });
      alert("Categoria criada com sucesso!");
    } catch (e: any) {
      alert(e?.message || "Erro ao criar categoria.");
    }
  };

  const handleSalvarCategoriaAtualizada = async (
    idCategoria: number,
    nomeCategoria: string,
    limiteGastoCategoria: number
  ) => {
    try {
      await updateCategoria(
        { nome: nomeCategoria, limite: limiteGastoCategoria },
        idCategoria
      );
      setShowModalConfigCategoria(false);
      await fetchCategorias({ showOverlay: true });
    } catch (e: any) {
      alert(e?.message || "Erro ao atualizar categoria.");
    }
  };

  const handleSalvarGasto = async ( data: {
    idCategoria: number;
    dataGasto: string;
    valor: number;
    descricao: string;
  }
  ) => {
    try {
      const gastos = {
        id_categoria: data.idCategoria,
        data_gasto: data.dataGasto,
        valor: data.valor,
        descricao: data.descricao
      }
      await addGasto(
        gastos,
        user!.id_usuario
      );
      setShowModalAddGastos(false);
      await fetchCategorias({ showOverlay: true });
    } catch (e: any) {
      alert(e?.message || "Erro ao adicionar gasto.");
    }
  };

  const handleConfirmDelete = async (idCategoria: number) => {
    try {
      await deleteCategoria(idCategoria);
      setShowModalConfirmDelete(false);
      setCategorias((prev) =>
        prev.filter((c) => c.id_categoria !== idCategoria)
      );
      await fetchCategorias({ showOverlay: true });
      alert("Categoria excluída com sucesso!");
    } catch (e: any) {
      alert(e?.message || "Erro ao excluir categoria.");
    }
  };

  // -------- UI --------
  return (
    <ProtectedRoute>
      <View style={gvStyles.container}>
        <LoadingOverlay visible={overlayLoading} />

        <FlatList
          data={categorias}
          keyExtractor={(item) => String(item.id_categoria)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          contentContainerStyle={gvStyles.content}
          ListHeaderComponent={
            <>
              {/* HEADER PREMIUM */}
              {error && (
                <View
                  style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 14,
                    backgroundColor: "rgba(255, 107, 107, 0.12)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 107, 107, 0.35)",
                  }}
                >
                  <Text style={{ color: "#FF6B6B", fontWeight: "900" }}>
                    {error}
                  </Text>

                  <TouchableOpacity
                    onPress={() => fetchCategorias({ showOverlay: true })}
                    style={{
                      marginTop: 10,
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor: "#2BE080",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "900", color: "#0B1220" }}>
                      Tentar novamente
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={gvStyles.headerCard}>
                <View style={gvStyles.headerTopRow}>
                  <View>
                    <Text style={gvStyles.headerTitle}>Gastos Variáveis</Text>
                    <Text style={gvStyles.headerSub}>{saldoMesText}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setShowModalConfigGastoMes(true)}
                  >
                    <MaterialIcons name="settings" size={22} color="#EAF0FF" />
                  </TouchableOpacity>
                </View>

                <View style={gvStyles.headerNumbersRow}>
                  <View style={gvStyles.metricBox}>
                    <Text style={gvStyles.metricLabel}>Gasto do mês</Text>
                    <Text style={gvStyles.metricValue}>
                      R$ {Number(gastostotalMes || 0).toFixed(2)}
                    </Text>
                  </View>

                  <View style={gvStyles.metricBox}>
                    <Text style={gvStyles.metricLabel}>Limite do mês</Text>
                    <Text style={gvStyles.metricValue}>
                      R$ {Number(gastosLimiteMes || 0).toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={gvStyles.progressWrap}>
                  <View style={gvStyles.progressBarBg}>
                    <View
                      style={[
                        gvStyles.progressBarFill,
                        { width: `${progressoMes * 100}%` },
                      ]}
                    />
                  </View>

                  {alertaGastoExcedido && (
                    <Text style={gvStyles.alertText}>
                      ⚠ Você excedeu o limite deste mês.
                    </Text>
                  )}
                </View>
              </View>

              <View style={gvStyles.sectionHeaderRow}>
                <Text style={gvStyles.sectionTitle}>Categorias</Text>
                <TouchableOpacity
                  onPress={() => setShowModalAddCategoria(true)}
                >
                  <Text style={gvStyles.sectionAction}>+ Nova</Text>
                </TouchableOpacity>
              </View>

              {categorias.length === 0 && (
                <View style={gvStyles.emptyBox}>
                  <Text style={gvStyles.emptyText}>
                    Nenhuma categoria cadastrada ainda. Crie uma categoria para
                    começar.
                  </Text>
                </View>
              )}
            </>
          }
          renderItem={({ item }) => {
            const limite = Number(item.limite || 0);
            const totalMes = Number(item.totalGastosMes || 0);

            const pct = limite > 0 ? Math.min(totalMes / limite, 1) : 0;

            return (
              <TouchableOpacity
                style={gvStyles.card}
                onPress={() => {
                  setCategoriaSelecionada(item);
                  setShowModalConfigCategoria(true);
                }}
                onLongPress={() => {
                  setCategoriaSelecionada(item);
                  setShowModalAddGastos(true);
                }}
              >
                <View style={gvStyles.cardRow}>
                  <Text style={gvStyles.cardTitle}>{item.nome}</Text>
                  <View style={gvStyles.pill}>
                    <Text style={gvStyles.pillText}>
                      {Math.round(pct * 100)}%
                    </Text>
                  </View>
                </View>

                <Text style={gvStyles.cardSub}>
                  Gastos do mês: R$ {totalMes.toFixed(2)} • Limite: R${" "}
                  {limite.toFixed(2)}
                </Text>

                {limite > 0 && (
                  <View style={[gvStyles.progressBarBg, { marginTop: 10 }]}>
                    <View
                      style={[
                        gvStyles.progressBarFill,
                        { width: `${pct * 100}%` },
                      ]}
                    />
                  </View>
                )}

                <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setCategoriaSelecionada(item);
                      setShowModalAddGastos(true);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialIcons
                      name="attach-money"
                      size={18}
                      color="#2BE080"
                    />
                    <Text style={{ color: "#2BE080", fontWeight: "900" }}>
                      Adicionar gasto
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setCategoriaSelecionada(item);
                      setShowModalConfirmDelete(true);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <MaterialIcons name="delete" size={18} color="#FF6B6B" />
                    <Text style={{ color: "#FF6B6B", fontWeight: "900" }}>
                      Excluir
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* FAB */}
        <TouchableOpacity
          style={gvStyles.fab}
          onPress={() => setShowModalAddCategoria(true)}
        >
          <MaterialIcons name="add" size={28} color="#0B1220" />
        </TouchableOpacity>

        {/* MODAIS (os seus) */}
        <AddModal
          visible={showModalAddCategoria}
          onClose={() => setShowModalAddCategoria(false)}
          onSave={handleSalvarCategoria}
        />

        <ConfigGastoMesModal
          visible={showModalConfigGastoMes}
          onClose={() => setShowModalConfigGastoMes(false)}
          onSave={handleSalvarGastoMes}
        />

        <ConfigGastoCategoriaModal
          visible={showModalConfigCategoria}
          onClose={() => setShowModalConfigCategoria(false)}
          onSave={handleSalvarCategoriaAtualizada}
          categoria={
            categoriaSelecionada
              ? {
                  id_categoria: categoriaSelecionada.id_categoria,
                  nome: categoriaSelecionada.nome,
                  limite: categoriaSelecionada.limite,
                }
              : null
          }
        />

        <AddGastosModal
          visible={showModalAddGastos}
          onClose={() => setShowModalAddGastos(false)}
          onSave={handleSalvarGasto}
          nomeCategoria={categoriaSelecionada?.nome || ""}
          idCategoria={categoriaSelecionada?.id_categoria || 0}
        />

        <ConfirmDelete
          visible={showModalConfirmDelete}
          onClose={() => setShowModalConfirmDelete(false)}
          onConfirm={() =>
            handleConfirmDelete(categoriaSelecionada?.id_categoria || 0)
          }
          message={`Tem certeza que deseja excluir a categoria ${categoriaSelecionada?.nome}?`}
        />
      </View>
    </ProtectedRoute>
  );
};

export default GastosVariaveis;
