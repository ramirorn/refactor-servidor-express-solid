import { Router, Request, Response, request } from "express";
import EmployeeControllers from "../controllers/employee.controllers.ts";

export class EmployeeRoutes {
    private router: Router;

    constructor(readonly controller: EmployeeControllers = new EmployeeControllers()) {
        this.controller = controller;
        this.router = Router();
    }

    routes() {
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