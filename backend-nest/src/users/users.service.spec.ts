import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

// Mock del TypeORM Repository
const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  remove: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));

    // Limpiar mocks entre tests
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const dto = {
        firstName: 'Juan',
        lastName: 'Perez',
        email: 'juan@test.com',
        phone: '+56912345678',
      };
      const user = { id: 1, ...dto } as User;

      repository.create.mockReturnValue(user);
      repository.save.mockResolvedValue(user);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, firstName: 'Juan' } as User;
      repository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      repository.count.mockResolvedValue(1);
      const result = await service.exists(1);
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      repository.count.mockResolvedValue(0);
      const result = await service.exists(999);
      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { id: 1, firstName: 'Juan' } as User;
      repository.findOne.mockResolvedValue(user);
      repository.remove.mockResolvedValue(user);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(user);
    });
  });
});
