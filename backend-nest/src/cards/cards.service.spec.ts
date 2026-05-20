import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockCardRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockUsersService = {
  exists: jest.fn(),
};

describe('CardsService', () => {
  let service: CardsService;
  let cardRepository: jest.Mocked<Repository<Card>>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getRepositoryToken(Card),
          useValue: mockCardRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    cardRepository = module.get(getRepositoryToken(Card));
    usersService = module.get(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create card for existing user', async () => {
      const dto = {
        userId: 1,
        cardNumber: '4111111111111111',
        cardHolder: 'JUAN PEREZ',
        expirationMonth: '12',
        expirationYear: '2028',
        cvv: '123',
        brand: 'visa',
      };
      const card = { id: 1, ...dto, lastFour: '1111', isActive: true } as Card;

      usersService.exists.mockResolvedValue(true);
      cardRepository.create.mockReturnValue(card);
      cardRepository.save.mockResolvedValue(card);

      const result = await service.create(dto);

      expect(usersService.exists).toHaveBeenCalledWith(1);
      expect(cardRepository.create).toHaveBeenCalled();
      expect(result.lastFour).toBe('1111');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const dto = {
        userId: 999,
        cardNumber: '4111111111111111',
        cardHolder: 'TEST',
        expirationMonth: '12',
        expirationYear: '2028',
        cvv: '123',
        brand: 'visa',
      };
      usersService.exists.mockResolvedValue(false);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return active cards for user', async () => {
      const cards = [{ id: 1, userId: 1, isActive: true } as Card];
      cardRepository.find.mockResolvedValue(cards);

      const result = await service.findByUser(1);
      expect(result).toEqual(cards);
    });
  });

  describe('findOne', () => {
    it('should return card if found', async () => {
      const card = { id: 1, cardNumber: '4111111111111111' } as Card;
      cardRepository.findOne.mockResolvedValue(card);

      const result = await service.findOne(1);
      expect(result).toEqual(card);
    });

    it('should throw NotFoundException if card not found', async () => {
      cardRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
