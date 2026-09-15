import { EmployeeRepository } from "../repository/employee.repository.ts";
import { IEmployee } from "../models/employee.model.ts";

export class EmployeeService {
    // Nuestros servicios dependeran de la interfaz del repositorio, no de la implementacion con mongo
    constructor(private readonly employeeRepository: EmployeeRepository) { }

    // Servicio de creacion de empleados
    async createEmployee(employeeData: Partial<IEmployee>) {
        // Validacion (todos los campos son obligatorios)
        if (!employeeData.name || !employeeData.position || employeeData.baseSalary === undefined || employeeData.yearsOfService === undefined) {
            throw new Error("Faltan campos obligatorios");
        }

        // Validacion de salario de tipo number y > 0
        if (typeof employeeData.baseSalary !== 'number' || employeeData.baseSalary <= 0) {
            throw new Error("El salario base debe ser un numero y mayor a 0");
        }

        // Validacion de antiguedad tipo number (entero) >= 0
        if (typeof employeeData.yearsOfService !== 'number' || employeeData.yearsOfService < 0 || !Number.isInteger(employeeData.yearsOfService)) {
            throw new Error("La antigüedad debe ser un entero mayor o igual a 0");
        }

        // Calculo del salario final
        const bonus = employeeData.baseSalary * 0.02 * employeeData.yearsOfService;
        const calculatedFinalSalary = employeeData.baseSalary + bonus;

        const newEmployeeData = {
            ...employeeData,
            finalSalary: calculatedFinalSalary
        };

        return await this.employeeRepository.create(newEmployeeData);
    }

    // Servicio de traer todos los empleados
    async findAllEmployees() {
        return await this.employeeRepository.findAll()
    }

    // Servicio de traer empleado por ID
    async findOneEmployeeById(id: string) {
        const employee = await this.employeeRepository.findById(id);

        if (!employee) {
            throw new Error(`No se encontro un empleado con el id: ${id} `);
        }

        return employee;
    }

    // Servicio de actualizar un empleado
    async updateEmployee(id: string, updateData: Partial<IEmployee>) {
        if (updateData.baseSalary !== undefined || updateData.yearsOfService !== undefined) {
            const currentEmployee = await this.findOneEmployeeById(id);

            // Se establece el nuevo salario y años si es que vienen, de otro modo, se dejan los que ya estaban
            const newBaseSalary = updateData.baseSalary ?? currentEmployee.baseSalary;
            const newYears = updateData.yearsOfService ?? currentEmployee.yearsOfService;

            // Calculo del salario final
            const bonus = newBaseSalary * 0.02 * newYears;
            const calculatedFinalSalary = newBaseSalary + bonus;

            // Establecemos el salario final actualizado
            updateData.finalSalary = calculatedFinalSalary;
        }
        const updatedEmployee = await this.employeeRepository.update(id, updateData);

        if (!updatedEmployee) {
            throw new Error(`El empleado con el id ${id} no existe`);
        }

        return updatedEmployee;
    }

    // Servicio de eliminar un empleado
    async deleteEmployee(id: string) {
        const isDeleted = await this.employeeRepository.delete(id);
        if (!isDeleted) {
            throw new Error(`No existe un empleado con el id: ${id}`);
        }
        return isDeleted;
    }
}
