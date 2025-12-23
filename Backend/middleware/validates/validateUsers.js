import { body, validationResult } from 'express-validator';
import ErroValidacao from '../../errors/validationError.js';

export const validateCreateUser = [
    body('nome')
    .trim().exists({ checkFalsy: true }).withMessage('O nome de usuário é obrigatório.')
    .isString().withMessage('O nome de usuário deve ser uma string.')
    .isLength({ min: 3 }).withMessage('O nome de usuário deve ter pelo menos 3 caracteres.'),

    body('email')
    .trim().exists({ checkFalsy: true }).withMessage('O email é obrigatório.')
    .isEmail().withMessage('O email deve ser um endereço de email válido.'),

    body('senha_hash')
    .trim().exists({ checkFalsy: true }).withMessage('A senha é obrigatória.')
    .isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
    .isStrongPassword() .withMessage('A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'),

    body('perfil_financeiro')
    .trim().exists({ checkFalsy: true }).withMessage('O perfil financeiro é obrigatório.')
    .isString().withMessage('O perfil financeiro deve ser uma string.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErroValidacao(errors.array()));
        }
        next();
    }
]

export const validateLoginUser = [
    body('email')
    .trim().exists({ checkFalsy: true }).withMessage('Email não fornecido')
    .isEmail().withMessage('O email deve ser um endereço de email válido.'),

    body('password')
    .trim().exists({ checkFalsy: true }).withMessage('Senha não fornecida'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ErroValidacao(errors.array()));
        }
        next();
    }
]