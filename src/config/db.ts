import mongoose from "mongoose"
import "dotenv/config"

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/employees_db';

export const connectDb = mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('No se pudo conectar a MongoDB', error);
        process.exit(1);
    });