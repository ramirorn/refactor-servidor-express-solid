import { IEmployee } from "../models/employee.model.ts";

// Definimos los metodos con los cuales trabajaremos
export interface EmployeeRepository {
    // Definimos Partial para indicar que no siempre iran todos los datos definidos en el contrato
    create(employeeData: Partial<IEmployee>): Promise<IEmployee>;
    findAll(): Promise<IEmployee[]>;
    findById(id: string): Promise<IEmployee | null>;
    update(id: string, updateData: Partial<IEmployee>): Promise<IEmployee | null>;
    delete(id: string): Promise<boolean>;
}