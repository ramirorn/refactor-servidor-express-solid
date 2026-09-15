import { EmployeeRepository } from "./employee.repository.ts"
import { Employee, IEmployee } from "../models/employee.model.ts";

// Implementamos los metodos de la interfaz EmployeeRepository
export class EmployeeMongoRepository implements EmployeeRepository {

    async create(employeeData: Partial<IEmployee>): Promise<IEmployee> {
        const newEmployee = new Employee(employeeData);
        return await newEmployee.save();
    }

    async findAll(): Promise<IEmployee[]> {
        return await Employee.find();
    }

    async findById(id: string): Promise<IEmployee | null> {
        return await Employee.findById(id);
    }

    async update(id: string, updateData: Partial<IEmployee>): Promise<IEmployee | null> {
        return await Employee.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await Employee.findByIdAndDelete(id);

        // Retorna true si lo borro, null si es que no encontro el empleado
        return result !== null;
    }
}   