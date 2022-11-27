import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PowerEffi User API',
      version: '1.0.0',
    },
  },
  schemaFolders: ['models'],
});
export default swaggerHandler();