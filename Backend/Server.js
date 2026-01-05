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

        // Registra Barramento de Eventos (domain events)
        const { default: BarramentoEventos } = await import('./utils/BarramentoEventos.js');
        DependencyInjector.register('BarramentoEventos', new BarramentoEventos());
        console.log('BarramentoEventos registrado com sucesso.');

        // Registro de repositórios
        const { default: UserRepository } = await import('./modules/usuario/userRepository.js');
        DependencyInjector.register('UserRepository', new UserRepository(database));
        console.log('UserRepository registrado com sucesso.');

        const { default: CategoriasRepository } = await import('./modules/categories/categoriasRepository.js');
        DependencyInjector.register('CategoriasRepository', new CategoriasRepository(database));
        console.log('CategoriasRepository registrado com sucesso.');

        const { default: GastosFixosRepository } = await import("./modules/gastos_fixos/GastosFixosRepository.js");
        DependencyInjector.register("GastosFixosRepository", new GastosFixosRepository(database));
        console.log("GastosFixosRepository registrado com sucesso.");


        const { default: GastoMesRepository } = await import('./modules/gastos/GastoMesRepository.js');
        DependencyInjector.register('GastoMesRepository', new GastoMesRepository(database));
        console.log('GastoMesRepository registrado com sucesso.');

        // Alertas / Notificações (NOVO)
        const { default: AlertasRepository } = await import('./modules/alertas/AlertasRepository.js');
        DependencyInjector.register('AlertasRepository', new AlertasRepository(database));

        const { default: NotificacoesService } = await import('./modules/alertas/NotificacoesService.js');
        DependencyInjector.register('NotificacoesService', new NotificacoesService());

        // Registro de Services
        const { default: UserService } = await import('./modules/usuario/UserService.js');
        DependencyInjector.register('UserService', new UserService(
            DependencyInjector.get('UserRepository')
        ));
        console.log('UserService registrado com sucesso.');

        const { default: CategoriasService } = await import('./modules/categories/CategoriasService.js');
        DependencyInjector.register('CategoriasService', new CategoriasService(
            DependencyInjector.get('CategoriasRepository'),
        ));
        console.log('CategoriasService registrado com sucesso.');

        const { default: GastoMesService } = await import('./modules/gastos/GastoMesService.js');
        DependencyInjector.register('GastoMesService', new GastoMesService(
        DependencyInjector.get('GastoMesRepository'),
        DependencyInjector.get('BarramentoEventos')
        ));
        console.log('GastoMesService registrado com sucesso.');

        const { default: GastosFixosService } = await import("./modules/gastos_fixos/GastosFixosService.js");
        DependencyInjector.register("GastosFixosService", new GastosFixosService(
        DependencyInjector.get("GastosFixosRepository")
        ));
        console.log("GastosFixosService registrado com sucesso.");


        // Registro de controllers
        const { default: UserController } = await import('./modules/usuario/userController.js');
        DependencyInjector.register('UserController', new UserController(
            DependencyInjector.get('UserService'),
            DependencyInjector.get('TransactionUtil')
        ));
        const { default: CategoriasController } = await import('./modules/categories/categoriasController.js');
        DependencyInjector.register('CategoriasController', new CategoriasController(
            DependencyInjector.get('CategoriasService'),
            DependencyInjector.get('TransactionUtil')
        ));
        const { default: GastoMesController } = await import('./modules/gastos/GastoMesController.js');
        DependencyInjector.register('GastoMesController', new GastoMesController(
            DependencyInjector.get('GastoMesService'),
            DependencyInjector.get('TransactionUtil')
        ));

        const { default: GastosFixosController } = await import("./modules/gastos_fixos/GastosFixosController.js");
        DependencyInjector.register("GastosFixosController", new GastosFixosController(
        DependencyInjector.get("GastosFixosService")
        ));
        console.log("GastosFixosController registrado com sucesso.");


        // AlertasService (NOVO)
        const { default: AlertasService } = await import('./modules/alertas/AlertasService.js');
        DependencyInjector.register('AlertasService', new AlertasService(
        DependencyInjector.get('AlertasRepository'),
        DependencyInjector.get('NotificacoesService')
        ));

        // Registra listeners de domínio (gastos) (NOVO)
        const { default: registrarListenersDeGastos } = await import('./modules/gastos/registrarListenersDeGastos.js');
        registrarListenersDeGastos({
        barramentoEventos: DependencyInjector.get('BarramentoEventos'),
        gastoMesRepository: DependencyInjector.get('GastoMesRepository'),
        alertasService: DependencyInjector.get('AlertasService'),
        userRepository: DependencyInjector.get('UserRepository'),
        });
       
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
        const { default: routerTest } = await import('./modules/routes/routerTest.js');
        app.use(routerTest);

        // Registro das Rotas
        const { default: UserRoutes } = await import('./modules/usuario/UserRoutes.js');
        const userController = DependencyInjector.get('UserController');

        const { default: CategoriasRoutes } = await import('./modules/categories/CategoriasRoutes.js');
        const categoriasController = DependencyInjector.get('CategoriasController');

        const { default: GastoMesRoutes } = await import('./modules/gastos/GastoMesRoutes.js');
        const gastoMesController = DependencyInjector.get('GastoMesController');

        const { default: GastosFixosRoutes } = await import("./modules/gastos_fixos/GastosFixosRoutes.js");
        const gastosFixosController = DependencyInjector.get("GastosFixosController");


        
        app.use(CategoriasRoutes(categoriasController));
        app.use(UserRoutes(userController));
        app.use(GastoMesRoutes(gastoMesController));
        app.use(GastosFixosRoutes(gastosFixosController));
        app.use(manipulador404);
        app.use(manipuladorDeErros);
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
