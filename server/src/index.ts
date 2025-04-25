import { app } from './app';
import { config } from './config';

const PORT = config.port || 3002;

try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoints available at:`);
    console.log(`- http://localhost:${PORT}/api/machines`);
    console.log(`- http://localhost:${PORT}/api/knowledge`);
    console.log(`- http://localhost:${PORT}/api/external`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
} 