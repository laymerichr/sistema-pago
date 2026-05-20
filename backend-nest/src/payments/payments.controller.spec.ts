import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';

const mockPaymentsService = {
  create: jest.fn(),
  findByUser: jest.fn(),
  findOne: jest.fn(),
};

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: jest.Mocked<PaymentsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get(PaymentsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const dto: CreatePaymentDto = {
        userId: 1,
        cardId: 1,
        amount: 150.0,
        currency: 'USD',
        description: 'Test payment',
      };
      const payment = { id: 1, status: 'approved', ...dto } as Payment;
      service.create.mockResolvedValue(payment);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(payment);
    });
  });

  describe('findByUser', () => {
    it('should return payment history', async () => {
      const payments = [{ id: 1, userId: 1 } as Payment];
      service.findByUser.mockResolvedValue(payments);

      const result = await controller.findByUser(1);
      expect(service.findByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(payments);
    });
  });

  describe('findOne', () => {
    it('should return payment by id', async () => {
      const payment = { id: 1, amount: 150.0 } as Payment;
      service.findOne.mockResolvedValue(payment);

      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(payment);
    });
  });
});
