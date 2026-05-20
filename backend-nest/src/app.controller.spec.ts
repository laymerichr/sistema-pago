import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Mock del AppService
const mockAppService = {
  getHello: jest.fn(),
};

describe('AppController', () => {
  let appController: AppController;
  let appService: jest.Mocked<AppService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get(AppService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('root', () => {
    it('should return API info object from service', () => {
      const apiInfo = {
        message: 'Sistema de Pagos API',
        version: '1.0.0',
        endpoints: ['/api/users', '/api/cards', '/api/payments'],
      };
      appService.getHello.mockReturnValue(apiInfo);

      const result = appController.getHello();

      expect(appService.getHello).toHaveBeenCalled();
      expect(result).toEqual(apiInfo);
      expect(result.message).toBe('Sistema de Pagos API');
      expect(result.version).toBe('1.0.0');
      expect(result.endpoints).toContain('/api/users');
    });
  });

  describe('health', () => {
    it('should return health status', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('OK');
      expect(result.timestamp).toBeDefined();
    });
  });
});
