import React from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { FinanciamentosStyles as s } from "@/styles/FinanciamentosStyles";
import { useFinanciamentosScreen } from "@/hooks/financiamentos/useFinanciamentosScreen";

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Financiamentos() {
  const {
    loading,
    error,
    dashboard,
    selectedId,
    setSelectedId,
    selected,
    valorAmortizar,
    setValorAmortizar,
    simResult,
  } = useFinanciamentosScreen();

  return (
    <View style={s.screen}>
      <ScrollView
        style={s.container}
        contentContainerStyle={{ paddingBottom: 26 }}
      >
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Text style={s.h1}>Financiamentos</Text>
            <Text style={s.h2}>
              Acompanhe seus financiamentos e calcule amortizações
            </Text>
          </View>

          <View style={s.headerRight}>
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor="rgba(234,240,255,0.35)"
              style={s.search}
            />
            <Pressable
              style={s.btnPrimary}
              onPress={() => alert("Em breve: Novo Financiamento")}
            >
              <Text style={s.btnPrimaryText}>+ Novo Financiamento</Text>
            </Pressable>
          </View>
        </View>

        {loading && (
          <Text style={{ color: "#EAF0FF", marginTop: 10 }}>Carregando...</Text>
        )}
        {!!error && (
          <Text style={{ color: "#F87171", marginTop: 10, fontWeight: "900" }}>
            {error}
          </Text>
        )}

        {!loading && !error && dashboard && (
          <>
            {/* Metrics topo (4) igual imagem */}
            <View style={s.metrics}>
              <View style={s.metric}>
                <Text style={s.metricLabel}>Dívida Total</Text>
                <Text style={s.metricValue}>{brl(dashboard.dividaTotal)}</Text>
              </View>
              <View style={s.metric}>
                <Text style={s.metricLabel}>Parcelas Mensais</Text>
                <Text style={s.metricValue}>
                  {brl(dashboard.parcelasMensais)}
                </Text>
              </View>
              <View style={s.metric}>
                <Text style={s.metricLabel}>Taxa Média</Text>
                <Text style={s.metricValue}>
                  {(dashboard.taxaMedia * 100).toFixed(2)}% a.m.
                </Text>
              </View>
              <View style={s.metric}>
                <Text style={s.metricLabel}>Meses Restantes</Text>
                <Text style={s.metricValue}>
                  ~{dashboard.mesesRestantes} meses
                </Text>
              </View>
            </View>

            <View style={s.gridRow}>
              {/* LEFT: cards financiamentos */}
              <View style={s.left}>
                <Text style={s.sectionTitle}>Seus Financiamentos</Text>

                {dashboard.items.map((f: any) => {
                  const prog = Math.min(
                    100,
                    Math.round((f.pagas / f.totalParcelas) * 100)
                  );
                  const restantes = f.totalParcelas - f.pagas;

                  return (
                    <Pressable
                      key={f.id}
                      onPress={() => setSelectedId(f.id)}
                      style={s.loanCard}
                    >
                      <View
                        style={[s.loanAccent, { backgroundColor: f.accent }]}
                      />

                      <View style={s.loanTop}>
                        <View style={{ flex: 1 }}>
                          <Text style={s.loanTitle}>{f.titulo}</Text>
                          <Text style={s.loanMeta}>
                            {f.tipo} • {f.banco}
                          </Text>
                        </View>
                        <Text style={{ color: "#EAF0FF", fontWeight: "900" }}>
                          {prog}%
                        </Text>
                      </View>

                      <Text style={[s.progressLabel, { marginTop: 10 }]}>
                        Progresso
                      </Text>
                      <View style={s.progressTrack}>
                        <View style={[s.progressFill, { width: `${prog}%` }]} />
                      </View>

                      <View style={s.progressLabelRow}>
                        <Text style={s.progressLabel}>{f.pagas} pagas</Text>
                        <Text style={s.progressLabel}>
                          {restantes} restantes
                        </Text>
                      </View>

                      <View style={s.kvRow}>
                        <View>
                          <Text style={s.k}>Parcela Mensal</Text>
                          <Text style={s.vGreen}>{brl(f.parcelaMensal)}</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text style={s.k}>Saldo Devedor</Text>
                          <Text style={s.v}>{brl(f.saldoDevedor)}</Text>
                        </View>
                      </View>

                      <Text style={[s.progressLabel, { marginTop: 8 }]}>
                        Taxa: {(f.taxaMensal * 100).toFixed(2)}% a.m.
                      </Text>

                      {selectedId === f.id && (
                        <View
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 18,
                            borderWidth: 2,
                            borderColor: "rgba(234,240,255,0.18)",
                          }}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* RIGHT: calculadora + tabela */}
              <View style={s.right}>
                <View style={s.panel}>
                  <Text style={s.panelTitle}>Calculadora de Amortização</Text>

                  {selected && (
                    <>
                      <Text style={s.panelSub}>
                        Saldo Devedor Atual: {brl(selected.saldoDevedor)}
                      </Text>
                      <Text style={s.panelSub}>
                        Parcelas Restantes:{" "}
                        {selected.totalParcelas - selected.pagas}x
                      </Text>
                      <Text style={s.panelSub}>
                        Taxa de Juros: {(selected.taxaMensal * 100).toFixed(2)}%
                        a.m.
                      </Text>
                    </>
                  )}

                  <View style={s.inputRow}>
                    <TextInput
                      value={valorAmortizar}
                      onChangeText={setValorAmortizar}
                      keyboardType="decimal-pad"
                      placeholder="5000,00"
                      placeholderTextColor="rgba(234,240,255,0.35)"
                      style={s.input}
                    />
                    <Pressable style={s.btnCalc} onPress={() => {}}>
                      <Text style={s.btnCalcText}>Calcular</Text>
                    </Pressable>
                  </View>

                  {simResult && (
                    <>
                      <Text style={[s.panelSub, { marginTop: 10 }]}>
                        Juros do mês: {brl(simResult.jurosMes)}
                      </Text>
                      <Text style={s.panelSub}>
                        Amortização: {brl(simResult.amortizacao)}
                      </Text>
                      <Text style={s.panelSub}>
                        Novo saldo estimado: {brl(simResult.novoSaldo)}
                      </Text>
                    </>
                  )}
                </View>

                <View style={s.panel}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={s.panelTitle}>Tabelade Amortização</Text>
                    <Text style={s.panelSub}>Expandir ▾</Text>
                  </View>

                  <View style={s.tableRow}>
                    <View style={s.tableBox}>
                      <Text style={s.tableK}>Total Pago</Text>
                      <Text style={s.tableV}>
                        {brl(dashboard.table.totalPago)}
                      </Text>
                    </View>
                    <View style={s.tableBox}>
                      <Text style={s.tableK}>Total Juros</Text>
                      <Text style={s.tableVRed}>
                        {brl(dashboard.table.totalJuros)}
                      </Text>
                    </View>
                    <View style={s.tableBox}>
                      <Text style={s.tableK}>Custo Efetivo</Text>
                      <Text style={s.tableVGreen}>
                        {dashboard.table.custoEfetivo.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
