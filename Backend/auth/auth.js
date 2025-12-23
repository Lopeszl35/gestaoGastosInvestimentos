import bcrypt from 'bcrypt';

export default class Auth {
    static async senhaValida(password, senhaHash) {
        // Verifica se a senha é válida
        const senhaValida = await bcrypt.compare(password, senhaHash);
            if (!senhaValida) {
                throw new Error("Senha inválida.");
            }
        return senhaValida;
    }

}
