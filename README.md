# Práctica SOLID - Empleados y Salarios

**Alumno:** Pereyra Roman, Ramiro Nicolás

**Materia:** Taller de Lenguajes de Programación IV

## Objetivo

La aplicación administra empleados y calcula su salario final. El proyecto está organizado en capas para separar responsabilidades y facilitar el mantenimiento:

- `controllers`: reciben las peticiones HTTP y construyen las respuestas.
- `routes`: definen los endpoints y los vinculan con los controladores.
- `services`: contienen las validaciones y reglas de negocio.
- `repository`: abstraen el acceso a los datos.
- `models`: definen la estructura de los empleados y el esquema de MongoDB.
- `config`: configura la conexión con la base de datos.

## Aplicación de los principios SOLID

### S: Single Responsibility Principle

Cada clase tiene una responsabilidad principal:

- `EmployeeControllers` traduce peticiones HTTP a llamadas al servicio y resultados del servicio a respuestas HTTP.
- `EmployeeService` valida los datos y aplica la regla de cálculo salarial.
- `EmployeeMongoRepository` realiza las operaciones de persistencia en MongoDB.
- `EmployeeRoutes` registra las rutas de la API.
- `Database` administra la conexión con MongoDB.

De esta manera, un cambio en la forma de almacenar datos no obliga a modificar la lógica de negocio ni la definición de las rutas.

### O: Open/Closed Principle

El servicio trabaja con el contrato `EmployeeRepository`, ubicado en `src/repository/employee.repository.ts`, y no con una implementación concreta. Por eso es posible agregar otra forma de persistencia, como un repositorio en memoria o para PostgreSQL, creando una nueva clase que implemente esa interfaz sin modificar `EmployeeService`.

### L: Liskov Substitution Principle

`EmployeeMongoRepository` puede utilizarse en cualquier lugar donde se espere un `EmployeeRepository`, porque implementa todos los métodos definidos por el contrato (`create`, `findAll`, `findById`, `update` y `delete`) respetando sus tipos y resultados. Cualquier otra implementación compatible debería poder sustituirla sin cambiar el comportamiento esperado por el servicio.

### I: Interface Segregation Principle

La interfaz `EmployeeRepository` expone únicamente las operaciones de empleados que necesita la aplicación. El servicio no depende de una interfaz grande con métodos de otros dominios ni de detalles propios de MongoDB; depende de un contrato pequeño y específico.

### D: Dependency Inversion Principle

`EmployeeService` recibe un `EmployeeRepository` por inyección de dependencias, en lugar de crear directamente un repositorio de MongoDB. En `src/server.ts` se ensamblan las dependencias concretas:

1. Se crea `EmployeeMongoRepository`.
2. Se lo inyecta en `EmployeeService`.
3. Se inyecta el servicio en `EmployeeControllers`.
4. Se inyecta el controlador en `EmployeeRoutes`.

Así, la lógica de alto nivel depende de abstracciones y la elección de MongoDB queda concentrada en el punto de composición de la aplicación.

## Regla de negocio

El salario final se calcula de la siguiente manera:

**salario final = salario base + 2% del salario base por cada año de antigüedad**

Ejemplo:

- Salario base: 1.000.000
- Antigüedad: 5 años
- Adicional: 10%
- Salario final: 1.100.000

Esta regla se implementa en `EmployeeService`, antes de enviar el empleado al repositorio. También se validan los campos obligatorios, que el salario sea mayor que cero y que la antigüedad sea un número entero mayor o igual a cero.

## Endpoints

La aplicación monta las rutas bajo el prefijo `/api`. Las rutas implementadas actualmente utilizan el recurso `employee` en singular:

- `POST /api/employee/`: crea un empleado.
- `GET /api/employee/`: devuelve todos los empleados.
- `GET /api/employee/:id`: devuelve un empleado por su identificador.
- `PUT /api/employee/:id`: actualiza un empleado.
- `DELETE /api/employee/:id`: elimina un empleado.

## Análisis de `docker-compose.yml`

Docker Compose permite definir y ejecutar servicios relacionados mediante un único archivo de configuración. En este proyecto se utiliza para levantar la base de datos que necesita la API, sin tener que instalar MongoDB directamente en el sistema operativo.

### Servicio configurado

El archivo define un único servicio:

- **`mongodb`**: crea un contenedor a partir de la imagen oficial `mongo:8`.
- **`container_name: empleados-mongodb`**: asigna un nombre reconocible al contenedor.
- **`restart: unless-stopped`**: reinicia el contenedor si se detiene por un error o por el reinicio de Docker, salvo que se lo detenga explícitamente.
- **`ports: "27017:27017"`**: publica el puerto de MongoDB del contenedor en el puerto `27017` de la computadora. El primer puerto es el del host y el segundo es el del contenedor.
- **`volumes: mongo_data:/data/db`**: guarda los archivos de MongoDB en un volumen administrado por Docker. Los datos sobreviven a la eliminación o recreación del contenedor.

Al final del archivo se declara `mongo_data` como volumen nombrado. Esto permite separar el ciclo de vida de los datos del ciclo de vida del contenedor.

### Relación con la aplicación

La clase `Database`, ubicada en `src/config/db.ts`, obtiene la conexión desde la variable de entorno `MONGO_URI`. Si esa variable no está definida, utiliza como valor predeterminado:

```text
mongodb://localhost:27017/employees_db
```

Por lo tanto, el flujo de ejecución es:

1. `docker compose up -d` inicia MongoDB en segundo plano.
2. La aplicación Node.js se ejecuta con `npm run dev` en el entorno local.
3. `Database.connect()` se conecta a MongoDB mediante el puerto publicado `27017`.
4. `EmployeeMongoRepository` utiliza el modelo de Mongoose para crear, consultar, actualizar y eliminar empleados.

Compose no ejecuta actualmente el servidor Express: solo proporciona la dependencia de infraestructura, que es MongoDB. La API continúa ejecutándose con Node.js mediante `npm run dev`.

## Cómo ejecutar

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

Si se utiliza una URI diferente, se puede definir `MONGO_URI` en el archivo `.env`, por ejemplo:

```env
MONGO_URI=mongodb://localhost:27017/employees_db
PORT=3000
```

## Conclusión

La separación entre rutas, controladores, servicios, repositorios y modelos reduce el acoplamiento entre las partes de la aplicación. La inyección de dependencias permite reemplazar la persistencia sin alterar la lógica de negocio, mientras que Docker Compose ofrece un entorno reproducible para ejecutar MongoDB y mantener los datos persistidos.
