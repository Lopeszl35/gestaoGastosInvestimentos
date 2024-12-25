import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import events from 'events';
import fs from 'fs';
import http from 'http';
import https from 'https';
import DependencyInjector from './utils/DependencyInjector.js'; // Utilitário de injeção de dependências

// Inicialização do Servidor
console.log('Servidor iniciando...');

// Aumenta o limite máximo de listeners para eventos
events.EventEmitter.defaultMaxListeners = 20;

// Carrega variáveis de ambiente
dotenv.config();

// Configuração do Servidor Express
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "*", // Substitua pelo domínio do frontend
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // Permite o envio de cookies
    })
);
app.use(morgan('dev'));

// Configuração da Sessão
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 dia
            secure: true, // Altere para `true` em produção com HTTPS
            httpOnly: true,
        },
    })
);

// Função para carregar as dependências
const loadDependencies = async () => {
    try {
        console.log('Carregando dependências...');

        // Configuração do banco de dados
        const { default: Database } = await import('./database/connection.js');
        const database = Database.getInstance();
        DependencyInjector.register('Database', database);

        console.log('Database registrado com sucesso.');

        // Registra TransactionUtil
        const { default: TransactionUtil } = await import('./utils/TransactionUtil.js');
        DependencyInjector.register('TransactionUtil', new TransactionUtil(DependencyInjector.get('Database')));


        // Registro de repositórios
        const { default: UserRepository } = await import('./repositories/userRepository.js');
        DependencyInjector.register('UserRepository', new UserRepository(database));
        console.log('UserRepository registrado com sucesso.');

        // Registro de models
        const { default: UserModel } = await import('./models/Entities/userModel/UserModel.js');
        DependencyInjector.register('UserModel', new UserModel(
            DependencyInjector.get('UserRepository')
        ));
        console.log('UserModel registrado com sucesso.');

        // Registro de controllers
        const { default: UserController } = await import('./controllers/userController.js');
        DependencyInjector.register('UserController', new UserController(
            DependencyInjector.get('UserModel'),
            DependencyInjector.get('TransactionUtil')
        ));
       
        console.log('Todas as dependências foram registradas!');
    } catch (error) {
        console.error('Erro ao carregar dependências:', error.message);
        process.exit(1); // Finaliza o servidor se algo der errado
    }
};

// Função para inicializar o servidor
const initializeServer = async () => {
    try {
        await loadDependencies();

        // Registro das Rotas
        const { default: UserRoutes } = await import('./routes/UserRoutes.js');
        const userController = DependencyInjector.get('UserController');

        const { default: routerTest } = await import('./routes/routerTest.js');
        app.use(routerTest);
     
        app.use(UserRoutes(userController));
        console.log('Rotas carregadas com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar o servidor:', error.message);
        process.exit(1); // Finaliza o servidor se algo der errado
    }
};

// Inicializa o Servidor e escuta na porta especificada
const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;

initializeServer().then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`Servidor rodando em http://${HOST}:${PORT}`);
    });
});

// Servidor HTTPS
https.createServer({
    cert: fs.readFileSync('./SSL/code.crt'), 
    key: fs.readFileSync('./SSL/code.key')
}, app).listen(443, ()=> console.log('Servidor rodando em https na porta 443'));

// Servidor HTTP para redirecionar para HTTPS
http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
}).listen(80, () => {
    console.log("Servidor HTTP rodando e redirecionando para HTTPS");
});
