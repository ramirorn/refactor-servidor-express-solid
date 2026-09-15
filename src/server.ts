import express, { Application } from "express"


class Server {
    private app: Application;

    constructor() {
        this.app = express();
    }

    dbConnect() { }

    middlewares() {
        this.app.use(express.json())
    }

    routes() { }

    listen() { }
}

const server = new Server()

export default server;