import React, { useEffect } from "react";
import {
    View,
    Dimensions,
    Text,
    ScrollView,
} from "react-native";
import { useUser } from "@/context/UserContext";
import  ProtectedRoute  from "@/components/ProtectedRoute";
import { BarChart } from "react-native-chart-kit";
import ScroolNav from "@/components/ScroolNav";

const width = Dimensions.get("window").width;

const GastosVariaveis: React.FC = () => {
    const { user } = useUser();

    const categoriasMock = [
        {
            id: 1,
            nome: "Mercado",
            valor: 100,
        },
        {
            id: 2,
            nome: "Uber",
            valor: 200,
        },
        {
            id: 3,
            name: "Ifood",
            value: 150,
        }
    ]

    useEffect(() => {
        
    })

    return (
        <ProtectedRoute>
            <ScrollView>
                <ScroolNav />
                <View>
                    <Text>Meus Gastos Variaveis</Text>
                    
                </View>
            </ScrollView>
        </ProtectedRoute>
    );
}

export default GastosVariaveis
