import express, { Application } from "express"
import "dotenv/config"

// Todas las capas
import { Database } from "./config/db.ts"
import { EmployeeMongoRepository } from "./repository/employee.mongo.repository.ts"
import { EmployeeService } from "./services/employee.service.ts"
import { EmployeeControllers } from "./controllers/employee.controllers.ts"
import { EmployeeRoutes } from "./routes/employee.routes.ts"

class Server {
    private app: Application;
    private port: string | number;
    private db: Database;

    constructor() {
        this.app = express();
        this.port = process.env.PORT ?? 3000;
        this.db = new Database()
        this.middlewares()
        this.routes()
    }

    async dbConnect() {
        await this.db.connect();
    }

    middlewares() {
        this.app.use(express.json())
    }

    routes() {
        // Ensamblaje de dependencias
        // Repositorio (BD)
        const employeeRepository = new EmployeeMongoRepository();
        // Servicio (Logica)
        const employeeService = new EmployeeService(employeeRepository);
        // Controlador (traductor)
        const employeeController = new EmployeeControllers(employeeService);
        // Rutas (endpoints)
        const employeeRoutes = new EmployeeRoutes(employeeController);
        // Ruta principal de la app
        this.app.use("/api", employeeRoutes.router);
    }

    async listen() {
        await this.dbConnect();

        this.app.listen(this.port, () => {
            console.log(`🚀 Servidor Express escuchando en http://localhost:${this.port}`)
        })
    }
}

const server = new Server()

server.listen()