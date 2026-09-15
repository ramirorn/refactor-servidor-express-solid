import { Request, Response } from "express";
import { EmployeeService } from "../services/employee.service.ts"
export class EmployeeControllers {

    constructor(private readonly employeeService: EmployeeService) { }

    createEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            // El servicio hace su trabajo con el req.body
            const newEmployee = await this.employeeService.createEmployee(req.body);
            res.status(201).json({
                status: "succes",
                data: newEmployee
            })
        } catch (error: any) {
            res.status(400).json({
                error: error.message
            })
        };
    }

    findAllEmployees = async (req: Request, res: Response): Promise<void> => {
        try {
            const employees = await this.employeeService.findAllEmployees();
            res.status(200).json(employees);
        } catch (error: any) {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    findOneEmployeeById = async (req: Request, res: Response): Promise<void> => {
        try {
            // Definir que el id vendra si o si como string
            const id = req.params.id as string;
            const employee = await this.employeeService.findOneEmployeeById(id);
            res.status(200).json(employee);
        } catch (error: any) {
            res.status(404).json({ error: error.message })
        }
    }

    updateEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            // Definir que el id vendra si o si como string
            const id = req.params.id as string;
            const updatedEmployee = await this.employeeService.updateEmployee(id, req.body);
            res.status(200).json({ status: "success", updatedEmployee });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    deleteEmployee = async (req: Request, res: Response): Promise<void> => {
        try {
            // Definir que el id vendra si o si como string
            const id = req.params.id as string;
            await this.employeeService.deleteEmployee(id);
            res.status(200).json({ message: "Empleado eliminado correctamente" })
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }
}

