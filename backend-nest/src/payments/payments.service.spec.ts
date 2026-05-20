import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { UsersService } from '../users/users.service';
import { CardsService } from '../cards/cards.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PythonServiceClient } from './../common/python-service.clients';

const mockPaymentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockUsersService = {
  findOne: jest.fn(),
};

const mockCardsService = {
  findOne: jest.fn(),
};

const mockProcessorClient = {
  process: jest.fn(),
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentRepository: jest.Mocked<Repository<Payment>>;
  let processorClient: jest.Mocked<PythonServiceClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
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
          provide: PythonServiceClient,
          useValue: mockProcessorClient,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentRepository = module.get(getRepositoryToken(Payment));
    processorClient = module.get(PythonServiceClient);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create approved payment', async () => {
      const dto = {
        userId: 1,
        cardId: 1,
        amount: 150.0,
        currency: 'USD',
        description: 'Test payment',
      };

      const user = { id: 1 } as any;
      const card = {
        id: 1,
        userId: 1,
        lastFour: '1111',
        isActive: true,
      } as any;
      const processorResult = {
        approved: true,
        reference: 'PY-20260518-1234',
        timestamp: new Date().toISOString(),
        processor_message: 'Aprobado',
      };
      const payment = { id: 1, status: 'approved', ...dto } as Payment;

      mockUsersService.findOne.mockResolvedValue(user);
      mockCardsService.findOne.mockResolvedValue(card);
      mockProcessorClient.process.mockResolvedValue(processorResult);
      paymentRepository.create.mockReturnValue(payment);
      paymentRepository.save.mockResolvedValue(payment);

      const result = await service.create(dto);

      expect(mockProcessorClient.process).toHaveBeenCalled();
      expect(paymentRepository.save).toHaveBeenCalled();
      expect(result.status).toBe('approved');
    });

    it('should create rejected payment', async () => {
      const dto = { userId: 1, cardId: 1, amount: 999.99, currency: 'USD' };
      const user = { id: 1 } as any;
      const card = {
        id: 1,
        userId: 1,
        lastFour: '1111',
        isActive: true,
      } as any;
      const processorResult = {
        approved: false,
        reference: 'PY-20260518-5678',
        timestamp: new Date().toISOString(),
        rejection_reason: 'Fondos insuficientes',
        processor_message: 'Rechazado',
      };
      const payment = { id: 1, status: 'rejected', ...dto } as Payment;

      mockUsersService.findOne.mockResolvedValue(user);
      mockCardsService.findOne.mockResolvedValue(card);
      mockProcessorClient.process.mockResolvedValue(processorResult);
      paymentRepository.create.mockReturnValue(payment);
      paymentRepository.save.mockResolvedValue(payment);

      const result = await service.create(dto);
      expect(result.status).toBe('rejected');
    });

    it('should throw BadRequestException if card does not belong to user', async () => {
      const dto = { userId: 1, cardId: 2, amount: 100, currency: 'USD' };
      const user = { id: 1 } as any;
      const card = { id: 2, userId: 99, isActive: true } as any;

      mockUsersService.findOne.mockResolvedValue(user);
      mockCardsService.findOne.mockResolvedValue(card);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if card is inactive', async () => {
      const dto = { userId: 1, cardId: 1, amount: 100, currency: 'USD' };
      const user = { id: 1 } as any;
      const card = { id: 1, userId: 1, isActive: false } as any;

      mockUsersService.findOne.mockResolvedValue(user);
      mockCardsService.findOne.mockResolvedValue(card);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByUser', () => {
    it('should return payment history for user', async () => {
      const payments = [{ id: 1, userId: 1, status: 'approved' } as Payment];
      mockUsersService.findOne.mockResolvedValue({ id: 1 } as any);
      paymentRepository.find.mockResolvedValue(payments);

      const result = await service.findByUser(1);
      expect(result).toEqual(payments);
    });
  });

  describe('findOne', () => {
    it('should return payment by id', async () => {
      const payment = { id: 1, amount: 150.0 } as Payment;
      paymentRepository.findOne.mockResolvedValue(payment);

      const result = await service.findOne(1);
      expect(result).toEqual(payment);
    });

    it('should throw NotFoundException if payment not found', async () => {
      paymentRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
