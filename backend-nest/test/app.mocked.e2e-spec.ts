import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import { UsersController } from './../src/users/users.controller';
import { UsersService } from './../src/users/users.service';
import { CardsController } from './../src/cards/cards.controller';
import { CardsService } from './../src/cards/cards.service';
import { PaymentsController } from './../src/payments/payments.controller';
import { PaymentsService } from './../src/payments/payments.service';

const apiInfo = {
  message: 'Sistema de pagos API funcionando',
  version: '1.0.0',
  endpoints: [
    'GET /',
    'GET /health',
    'POST /users',
    'POST /cards',
    'POST /payments',
  ],
};

const mockUser = {
  id: 1,
  firstName: 'María',
  lastName: 'González',
  email: 'maria.gonzalez@example.com',
  phone: '+541112345678',
  createdAt: '2026-05-20T10:00:00.000Z',
  updatedAt: '2026-05-20T10:00:00.000Z',
  cards: [],
  payments: [],
};

const mockCard = {
  id: 2,
  userId: 1,
  cardNumber: '4111111111111111',
  cardHolder: 'María González',
  expirationMonth: '12',
  expirationYear: '2028',
  cvv: '123',
  brand: 'Visa',
  lastFour: '1111',
  isActive: true,
  createdAt: '2026-05-20T10:05:00.000Z',
  updatedAt: '2026-05-20T10:05:00.000Z',
};

const mockPayment = {
  id: 3,
  userId: 1,
  cardId: 2,
  amount: 150.5,
  currency: 'USD',
  description: 'Pago de prueba',
  status: 'approved',
  rejectionReason: null,
  createdAt: '2026-05-20T10:10:00.000Z',
  updatedAt: '2026-05-20T10:10:00.000Z',
};

const mockAppService = {
  getHello: jest.fn().mockReturnValue(apiInfo),
};

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  remove: jest.fn().mockResolvedValue(undefined),
};

const mockCardsService = {
  create: jest.fn().mockResolvedValue(mockCard),
  findByUser: jest.fn().mockResolvedValue([mockCard]),
  deactivate: jest.fn().mockResolvedValue(undefined),
  remove: jest.fn().mockResolvedValue(undefined),
};

const mockPaymentsService = {
  create: jest.fn().mockResolvedValue(mockPayment),
  findByUser: jest.fn().mockResolvedValue([mockPayment]),
  findOne: jest.fn().mockResolvedValue(mockPayment),
};

describe('Mocked e2e suite', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        AppController,
        UsersController,
        CardsController,
        PaymentsController,
      ],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CardsService,
          useValue: mockCardsService,
        },
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('GET / returns API info', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect(apiInfo);
  });

  it('GET /health returns service health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('OK');
        expect(typeof body.timestamp).toBe('string');
      });
  });

  it('POST /users returns created user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        firstName: 'María',
        lastName: 'González',
        email: 'maria.gonzalez@example.com',
        phone: '+541112345678',
      })
      .expect(201)
      .expect(mockUser);
  });

  it('GET /users returns user list', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect([mockUser]);
  });

  it('POST /cards returns created card', () => {
    return request(app.getHttpServer())
      .post('/cards')
      .send({
        userId: 1,
        cardNumber: '4111111111111111',
        cardHolder: 'María González',
        expirationMonth: '12',
        expirationYear: '2028',
        cvv: '123',
        brand: 'Visa',
      })
      .expect(201)
      .expect(mockCard);
  });

  it('PATCH /cards/2/deactivate returns 200', () => {
    return request(app.getHttpServer())
      .patch('/cards/2/deactivate')
      .expect(200);
  });

  it('POST /payments returns created payment', () => {
    return request(app.getHttpServer())
      .post('/payments')
      .send({
        userId: 1,
        cardId: 2,
        amount: 150.5,
      })
      .expect(201)
      .expect(mockPayment);
  });

  it('GET /payments/user/1 returns payments list', () => {
    return request(app.getHttpServer())
      .get('/payments/user/1')
      .expect(200)
      .expect([mockPayment]);
  });
});
