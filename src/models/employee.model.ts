import { Schema, model, Document } from "mongoose";

// Definicion del contrato que tendra un empleado (forma de los datos)
export interface IEmployee {
    name: string;
    position: string;
    baseSalary: number;
    yearsOfService: number;
    finalSalary: number;
}

// Nuestro esquema espera los datos de la forma en que fueron definidos en el contrato
const employeeSchema = new Schema<IEmployee>(
    {
        name: { type: String, required: true },
        position: { type: String, required: true },
        baseSalary: { type: Number, required: true },
        yearsOfService: { type: Number, required: true },
        finalSalary: { type: Number, required: true }
    },
    { timestamps: true }
);

// El modelo maneja datos del tipo IEmployee
export const Employee = model<IEmployee>('Employee', employeeSchema);
