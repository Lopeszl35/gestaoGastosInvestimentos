import bcrypt from 'bcrypt';
import ErroValidacao from '../errors/validationError.js';

export default class Auth {
    static async senhaValida(password, senhaHash) {
        // Verifica se a senha é válida
        const senhaValida = await bcrypt.compare(password, senhaHash);
            if (!senhaValida) {
                throw new ErroValidacao([{ msg: "Senha inválida." }]);
            }
        return senhaValida;
    }

}
