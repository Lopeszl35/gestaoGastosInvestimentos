import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import events from 'events';
import manipulador404 from './middleware/manipulador404.js';
/*
import fs from 'fs';
import http from 'http';
import https from 'https';
*/
import DependencyInjector from './utils/DependencyInjector.js'; // Utilitário de injeção de dependências
import manipuladorDeErros from './middleware/manipuladorDeErros.js';
import verifyToken from './middleware/verifyToken.js';

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
        origin: '*', // Substitua pelo domínio do frontend
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
            secure: false, // Altere para `true` em produção com HTTPS
            httpOnly: true,
            sameSite: 'lax',
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
        const { default: UserRepository } = await import('./modules/usuario/userRepository.js');
        DependencyInjector.register('UserRepository', new UserRepository(database));
        console.log('UserRepository registrado com sucesso.');

        const { default: CategoriasRepository } = await import('./repositories/categoriasRepository.js');
        DependencyInjector.register('CategoriasRepository', new CategoriasRepository(database));
        console.log('CategoriasRepository registrado com sucesso.');

        const { default: GastoMesRepository } = await import('./repositories/GastoMesRepository.js');
        DependencyInjector.register('GastoMesRepository', new GastoMesRepository(database));
        console.log('GastoMesRepository registrado com sucesso.');

        // Registro de Services
        const { default: UserModel } = await import('./modules/usuario/UserService.js');
        DependencyInjector.register('UserModel', new UserModel(
            DependencyInjector.get('UserRepository')
        ));
        console.log('UserServiece registrado com sucesso.');

        // Registro de models
        const { default: CategoriasModel } = await import('./models/Entities/categoriasModel/CategoriasModel.js');
        DependencyInjector.register('CategoriasModel', new CategoriasModel(
            DependencyInjector.get('CategoriasRepository')
        ));
        console.log('CategoriasModel registrado com sucesso.');

        const { default: GastoMesModel } = await import('./models/Entities/gastoMesModel/GastoMesModel.js');
        DependencyInjector.register('GastoMesModel', new GastoMesModel(
            DependencyInjector.get('GastoMesRepository')
        ));
        console.log('GastoMesModel registrado com sucesso.');

        // Registro de controllers
        const { default: UserController } = await import('./modules/usuario/userController.js');
        DependencyInjector.register('UserController', new UserController(
            DependencyInjector.get('UserModel'),
            DependencyInjector.get('TransactionUtil')
        ));
        const { default: CategoriasController } = await import('./controllers/categoriasController.js');
        DependencyInjector.register('CategoriasController', new CategoriasController(
            DependencyInjector.get('CategoriasModel'),
            DependencyInjector.get('TransactionUtil')
        ));
        const { default: GastoMesController } = await import('./controllers/GastoMesController.js');
        DependencyInjector.register('GastoMesController', new GastoMesController(
            DependencyInjector.get('GastoMesModel'),
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

        // Rotas para teste
        const { default: routerTest } = await import('./routes/routerTest.js');
        app.use(routerTest);

        // Registro das Rotas
        const { default: UserRoutes } = await import('./modules/usuario/UserRoutes.js');
        const userController = DependencyInjector.get('UserController');

        const { default: CategoriasRoutes } = await import('./routes/CategoriasRoutes.js');
        const categoriasController = DependencyInjector.get('CategoriasController');

        const { default: GastoMesRoutes } = await import('./routes/GastoMesRoutes.js');
        const gastoMesController = DependencyInjector.get('GastoMesController');

        
        app.use(CategoriasRoutes(categoriasController));
        app.use(UserRoutes(userController));
        app.use(GastoMesRoutes(gastoMesController));
        app.use(manipuladorDeErros);
        app.use(manipulador404);
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

//Testar conexao com o banco de dados	
async function testDatabaseConnection() {
    try {
        const { default: Database } = await import('./database/connection.js');
        const database = Database.getInstance();
        const result = await database.executaComando('SELECT 1 + 1 AS solution');
        console.log('Conexão com o banco de dados estabelecida com sucesso. Sua solução é:', result);
    } catch (error) {
        console.error('Erro ao estabelecer conexão com o banco de dados:', error.message);
    }
}

testDatabaseConnection();

/* Servidor HTTPS
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
});*/
