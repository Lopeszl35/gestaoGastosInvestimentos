import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { stylesScroolNav } from "@/styles/ScroolNav";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Definição do tipo para as props
interface ScroolNavProps {
  onCategoriaSelecionada: (nome: string) => void;
  onAdicionarCategorias: () => void; // Corrigido para usar a função correta
}

const ScroolNav: React.FC<ScroolNavProps> = ({
  onCategoriaSelecionada,
  onAdicionarCategorias,
}) => {
  const [categorias, setCategorias] = useState<any[]>([]);

  // Simula uma chamada ao banco de dados para carregar as categorias
  useEffect(() => {
    setTimeout(() => {
      const categoriasMock = [
        { id: 1, nome: "Mercado", valor: 100 },
        { id: 2, nome: "Uber", valor: 200 },
        { id: 3, nome: "Ifood", valor: 150 },
        { id: 4, nome: "Academia", valor: 120 },
        { id: 5, nome: "Cinema", valor: 90 },
        { id: 6, nome: "Farmácia", valor: 250 },
        { id: 7, nome: "Roupas", valor: 300 },
      ];
      setCategorias(categoriasMock);
    }, 1000); // Simula 1 segundo de atraso na chamada ao banco
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={stylesScroolNav.container}
    >
      {categorias.map((categoria) => (
        <TouchableOpacity
          key={categoria.id}
          style={stylesScroolNav.item}
          onPress={() => onCategoriaSelecionada(categoria.nome)}
        >
          <Text style={stylesScroolNav.itemText}>{categoria.nome}</Text>
        </TouchableOpacity>
      ))}
      {/* Botão de Adicionar Categorias */}
      <TouchableOpacity
        style={stylesScroolNav.addButton}
        onPress={onAdicionarCategorias} // Corrigido para chamar a função correta
      >
        <MaterialIcons name="add" size={15} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ScroolNav;
