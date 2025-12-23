import jwt from 'jsonwebtoken';

export function generateToken(user) {
    // Gera um token JWT
    const token = jwt.sign(
            { id: user.id_usuario, email: user.email },
            process.env.JWT_SECRET, // Segredo do JWT
            { expiresIn: "1d" } // Expira em 1 dia
    );
    return token;
}