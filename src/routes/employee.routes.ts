import { Router } from "express";
import { EmployeeControllers } from "../controllers/employee.controllers.ts";

export class EmployeeRoutes {
    // Modificador publico para poder acceder al router desde cualquier archivo externo
    public readonly router: Router;

    // Recibe el controlador ya instanciado desde fuera (inyeccion de dependencias)
    constructor(private readonly controller: EmployeeControllers) {
        this.router = Router();
        this.initializeRoutes();
    }

    // Se dispara en automatico al instanciar la clase
    private initializeRoutes() {
        // Traer todos los empleados
        this.router.get("/employee/", this.controller.findAllEmployees);
        // Crear un nuevo empleado
        this.router.post("/employee/", this.controller.createEmployee);
        // Traer empleado por id
        this.router.get("/employee/:id", this.controller.findOneEmployeeById);
        // Actualizar empleado
        this.router.put("/employee/:id", this.controller.updateEmployee);
        // Eliminar empleado
        this.router.delete("/employee/:id", this.controller.deleteEmployee);
    }
}