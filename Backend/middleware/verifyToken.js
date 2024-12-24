import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SESSION_SECRET;

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    // Verifica se o token existe
    if (!token) {
        return res.status(403).json({ error: 'Nenhum token fornecido' });
    }

    // Remove o prefixo 'Bearer ' se ele existir
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Remove 'Bearer ' da string do token
    }

    try {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Falha na autenticação do token', token: token, err });
            }
            req.userId = decoded.id; // Decodifica e anexa o ID do usuário à requisição
            next();
        });
    } catch (error) {
        return res.status(401).json({ error: 'Falha na autenticação do token', error });
    }
};

export default verifyToken;
