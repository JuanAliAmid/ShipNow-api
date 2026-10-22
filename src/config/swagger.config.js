import swaggerJSDoc from 'swagger-jsdoc';
import { env } from "./index.js";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShipNow API',
      version: '1.0.0',
      description:
        'Documentación de la API ShipNow para gestión de usuarios, pedidos, entregas, mocks, errores y logging.'
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Servidor local'
      }
    ]
  },
  apis: ['./src/docs/*.yaml']
});

export default swaggerSpec;
