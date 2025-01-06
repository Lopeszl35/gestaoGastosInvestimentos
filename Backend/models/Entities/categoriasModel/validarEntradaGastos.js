

export default function validarEntradaGastos(gastos) {
    const erros = [];
    if (gastos.valor === 0) {
        erros.push("Nenhum gasto informado.");
    }
    if (gastos.dataGasto === "") {
        erros.push("Nenhuma data informada.");
    }
    if(erros.length > 0) {
        return erros;
    } else {
        return true;
    }
}