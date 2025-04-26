const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Meydan API',
      version: '1.0.0',
      description: 'Meydan API dokümantasyonu',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Geliştirme sunucusu',
      },
    ],
  },
  apis: ['./app/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs; 