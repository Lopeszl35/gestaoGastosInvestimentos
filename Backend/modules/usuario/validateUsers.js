import { body, param, validationResult } from 'express-validator';
import ErroValidacao from '../../errors/ValidationError.js';

// helper para encerrar com erros padronizados
function handleValidation(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new ErroValidacao(errors.array()));
  return next();
}

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

    body('salario_mensal')
    .optional()
    .isFloat({ min: 0 }).withMessage('O salário mensal deve ser um número positivo.'),

    body('saldo_inicial')
    .optional()
    .isFloat({ min: 0 }).withMessage('O saldo inicial deve ser um número positivo.'),

    body('saldo_atual')
    .optional()
    .isFloat({ min: 0 }).withMessage('O saldo atual deve ser um número positivo.'),

    handleValidation
]

export const validateUpdateUser = [
  body("nome").optional().trim().isLength({ min: 3 }).withMessage("O nome deve ter pelo menos 3 caracteres."),
  body("email").optional().trim().isEmail().withMessage("O email deve ser válido."),
  body("senha").optional().trim().isStrongPassword().withMessage("Senha fraca."),
  body("perfil_financeiro").optional().trim().isString().withMessage("O perfil financeiro deve ser uma string."),
  body("salario_mensal").optional().isFloat({ min: 0 }).withMessage("O salário mensal deve ser positivo."),

  // NÃO EXISTE:
  body("saldo_atual").not().exists().withMessage("saldo_atual não pode ser alterado por esta rota."),
  body("saldo_inicial").not().exists().withMessage("saldo_inicial não pode ser alterado por esta rota."),

  handleValidation,
];

export const validateLoginUser = [
    body('email')
    .trim().exists({ checkFalsy: true }).withMessage('Email não fornecido')
    .isEmail().withMessage('O email deve ser um endereço de email válido.'),

    body('senha_hash')
    .trim().exists({ checkFalsy: true }).withMessage('Senha não fornecida'),
    
    handleValidation
]

export const validateGetUserSaldo = [
    body('userId')
    .trim().exists({ checkFalsy: true }).withMessage('ID do usuário não fornecido')
    .isInt().withMessage('ID do usuário deve ser um número inteiro.'),
    
    handleValidation
]

export const validateUserSaldo = [
    body('userID')
    .trim().exists({ checkFalsy: true }).withMessage("ID do usuário não fornecido")
    .isInt().withMessage("ID do usuário deve ser um número inteiro."),

    body('saldo')
    .trim().exists({ checkFalsy: true }).withMessage("Saldo não fornecido")
    .isFloat().withMessage("Saldo deve ser um número válido."),

    handleValidation
]

export const validateDeleteUser = [
    param('userId')
    .trim().exists({ checkFalsy: true }).withMessage('ID do usuário é obrigatório.')
    .isInt().withMessage('ID do usuário deve ser um número inteiro.'),

    handleValidation
]

