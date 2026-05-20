import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';

const mockCardsService = {
  create: jest.fn(),
  findByUser: jest.fn(),
  remove: jest.fn(),
};

describe('CardsController', () => {
  let controller: CardsController;
  let service: jest.Mocked<CardsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
          useValue: mockCardsService,
        },
      ],
    }).compile();

    controller = module.get<CardsController>(CardsController);
    service = module.get(CardsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should register a card', async () => {
      const dto: CreateCardDto = {
        userId: 1,
        cardNumber: '4111111111111111',
        cardHolder: 'JUAN PEREZ',
        expirationMonth: '12',
        expirationYear: '2028',
        cvv: '123',
        brand: 'visa',
      };
      const card = { id: 1, ...dto, lastFour: '1111' } as Card;
      service.create.mockResolvedValue(card);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(card);
    });
  });

  describe('findByUser', () => {
    it('should return cards for user', async () => {
      const cards = [{ id: 1, userId: 1 } as Card];
      service.findByUser.mockResolvedValue(cards);

      const result = await controller.findByUser(1);
      expect(service.findByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(cards);
    });
  });
});
