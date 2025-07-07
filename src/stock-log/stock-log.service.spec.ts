import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockLogService } from './stock-log.service';
import { StockLog } from './entity/stock-log.entity';
import { Products } from '../product/entity/product.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('StockLogService', () => {
  let service: StockLogService;
  let stockLogRepo: Repository<StockLog>;
  let productRepo: Repository<Products>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockLogService,
        {
          provide: getRepositoryToken(StockLog),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Products),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StockLogService>(StockLogService);
    stockLogRepo = module.get<Repository<StockLog>>(getRepositoryToken(StockLog));
    productRepo = module.get<Repository<Products>>(getRepositoryToken(Products));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repositories injected', () => {
    expect(stockLogRepo).toBeDefined();
    expect(productRepo).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all stock logs', async () => {
      const mockLogs = [
        { id: '1', change: 10, reason: 'Stock added', logged_at: new Date() },
        { id: '2', change: -5, reason: 'Stock sold', logged_at: new Date() },
      ];
      
      jest.spyOn(stockLogRepo, 'find').mockResolvedValue(mockLogs as any);
      
      const result = await service.findAll();
      expect(result.data).toEqual(mockLogs);
      expect(result.message).toBe('Fetched all stock logs successfully');
    });

    it('should handle errors in findAll', async () => {
      jest.spyOn(stockLogRepo, 'find').mockRejectedValue(new Error('Database error'));
      
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByProduct', () => {
    it('should return stock logs for a specific product', async () => {
      const mockLogs = [
        { id: '1', change: 10, reason: 'Stock added', logged_at: new Date() },
        { id: '2', change: -5, reason: 'Stock sold', logged_at: new Date() },
      ];
      
      jest.spyOn(stockLogRepo, 'find').mockResolvedValue(mockLogs as any);
      
      const result = await service.findByProduct('1');
      expect(result.data).toEqual(mockLogs);
      expect(result.message).toBe('Fetched product stock logs successfully');
    });

    it('should handle errors in findByProduct', async () => {
      jest.spyOn(stockLogRepo, 'find').mockRejectedValue(new Error('Database error'));
      
      await expect(service.findByProduct('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new stock log with stock update', async () => {
      const createDto = { 
        productId: '1', 
        change: 10, 
        reason: 'Stock added',
        updateStock: true
      };
      const mockProduct = { id: '1', name: 'Product 1', quantity: 100 };
      const updatedProduct = { ...mockProduct, quantity: 110 };
      const mockLog = { id: '1', product: mockProduct, change: 10, reason: 'Stock added' };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as any);
      jest.spyOn(productRepo, 'save').mockResolvedValue(updatedProduct as any);
      jest.spyOn(stockLogRepo, 'create').mockReturnValue(mockLog as any);
      jest.spyOn(stockLogRepo, 'save').mockResolvedValue(mockLog as any);
      
      const result = await service.create(createDto);
      expect(result.data).toEqual(mockLog);
      expect(result.message).toBe('Stock log created successfully');
    });

    it('should create a new stock log without stock update', async () => {
      const createDto = { 
        productId: '1', 
        change: 10, 
        reason: 'Stock added',
        updateStock: false
      };
      const mockProduct = { id: '1', name: 'Product 1', quantity: 100 };
      const mockLog = { id: '1', product: mockProduct, change: 10, reason: 'Stock added' };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as any);
      jest.spyOn(stockLogRepo, 'create').mockReturnValue(mockLog as any);
      jest.spyOn(stockLogRepo, 'save').mockResolvedValue(mockLog as any);
      
      const result = await service.create(createDto);
      expect(result.data).toEqual(mockLog);
      expect(result.message).toBe('Stock log created successfully');
    });

    it('should throw BadRequestException when product not found', async () => {
      const createDto = { 
        productId: '999', 
        change: 10, 
        reason: 'Stock added'
      };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(null);
      
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for insufficient stock', async () => {
      const createDto = { 
        productId: '1', 
        change: -10, 
        reason: 'Stock sold',
        updateStock: true
      };
      const mockProduct = { id: '1', name: 'Product 1', quantity: 5 };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as any);
      
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should handle errors in create', async () => {
      const createDto = { 
        productId: '1', 
        change: 10, 
        reason: 'Stock added'
      };
      const mockProduct = { id: '1', name: 'Product 1', quantity: 100 };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as any);
      jest.spyOn(productRepo, 'save').mockRejectedValue(new Error('Database error'));
      
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });
});
