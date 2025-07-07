import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { Products } from './entity/product.entity';
import { StockLog } from '../stock-log/entity/stock-log.entity';
import { Supplier } from '../supplier/entity/supplier.entity';
import { BadRequestException, NotFoundException, BadGatewayException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: Repository<Products>;
  let stockLogRepo: Repository<StockLog>;
  let supplierRepo: Repository<Supplier>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Products),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
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
          provide: getRepositoryToken(Supplier),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get<Repository<Products>>(getRepositoryToken(Products));
    stockLogRepo = module.get<Repository<StockLog>>(getRepositoryToken(StockLog));
    supplierRepo = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repositories injected', () => {
    expect(productRepo).toBeDefined();
    expect(stockLogRepo).toBeDefined();
    expect(supplierRepo).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 10.99, quantity: 100 },
        { id: '2', name: 'Product 2', price: 20.99, quantity: 50 },
      ];
      
      jest.spyOn(productRepo, 'find').mockResolvedValue(mockProducts as any);
      
      const result = await service.findAll();
      expect(result.data).toEqual(mockProducts);
      expect(result.message).toBe('Fetched products successfully');
    });

    it('should handle errors in findAll', async () => {
      jest.spyOn(productRepo, 'find').mockRejectedValue(new Error('Database error'));
      
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const mockProduct = { id: '1', name: 'Product 1', price: 10.99, quantity: 100 };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as any);
      
      const result = await service.findOne('1');
      expect(result.data).toEqual(mockProduct);
      expect(result.message).toBe('Fetched product successfully');
    });

    it('should throw BadRequestException when product not found', async () => {
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(null);
      
      await expect(service.findOne('999')).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto = { 
        name: 'New Product', 
        description: 'A new product description',
        in_stock: true,
        price: 15.99, 
        quantity: 50, 
        supplierId: '1' 
      };
      const mockSupplier = { id: '1', name: 'Supplier 1' };
      const mockProduct = { id: '1', ...createDto, price: 15.99 };
      
      jest.spyOn(supplierRepo, 'findOne').mockResolvedValue(mockSupplier as any);
      jest.spyOn(productRepo, 'create').mockReturnValue(mockProduct as any);
      jest.spyOn(productRepo, 'save').mockResolvedValue(mockProduct as any);
      
      const result = await service.create(createDto);
      expect(result.data).toEqual(mockProduct);
      expect(result.message).toBe('Product created successfully');
    });

    it('should throw BadGatewayException when supplier not found', async () => {
      const createDto = { 
        name: 'New Product', 
        description: 'A new product description',
        in_stock: true,
        price: 15.99, 
        quantity: 50, 
        supplierId: '999' 
      };
      
      jest.spyOn(supplierRepo, 'findOne').mockResolvedValue(null);
      
      await expect(service.create(createDto)).rejects.toThrow(BadGatewayException);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const updateDto = { name: 'Updated Product', price: 25.99 };
      const mockProduct = { id: '1', name: 'Updated Product', price: 25.99, quantity: 100 };
      
      jest.spyOn(productRepo, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as any);
      
      const result = await service.update('1', updateDto);
      expect(result.data).toEqual(mockProduct);
      expect(result.message).toBe('Product updated successfully');
    });

    it('should throw BadRequestException when product not found for update', async () => {
      const updateDto = { name: 'Updated Product' };
      
      jest.spyOn(productRepo, 'update').mockResolvedValue({ affected: 0 } as any);
      
      await expect(service.update('999', updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an existing product', async () => {
      const mockProduct = { id: '1', name: 'Product 1', price: 10.99, quantity: 100 };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as any);
      jest.spyOn(productRepo, 'remove').mockResolvedValue(mockProduct as any);
      
      const result = await service.remove('1');
      expect(result.data).toBeNull();
      expect(result.message).toBe('Product removed successfully');
    });

    it('should throw BadRequestException when product not found for removal', async () => {
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(null);
      
      await expect(service.remove('999')).rejects.toThrow(BadRequestException);
    });
  });

  describe('changeStock', () => {
    it('should change stock successfully', async () => {
      const mockProduct = { id: '1', name: 'Product 1', price: 10.99, quantity: 100 };
      const changeDto = { change: 10, reason: 'Stock added' };
      const updatedProduct = { ...mockProduct, quantity: 110 };
      const mockLog = { id: '1', product: mockProduct, change: 10, reason: 'Stock added' };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as any);
      jest.spyOn(productRepo, 'save').mockResolvedValue(updatedProduct as any);
      jest.spyOn(stockLogRepo, 'create').mockReturnValue(mockLog as any);
      jest.spyOn(stockLogRepo, 'save').mockResolvedValue(mockLog as any);
      
      const result = await service.changeStock('1', changeDto);
      expect(result.data).toEqual(updatedProduct);
      expect(result.message).toBe('Stock updated and log created successfully');
    });

    it('should throw BadGatewayException for insufficient stock', async () => {
      const mockProduct = { id: '1', name: 'Product 1', price: 10.99, quantity: 5 };
      const changeDto = { change: -10, reason: 'Stock sold' };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(mockProduct as any);
      
      await expect(service.changeStock('1', changeDto)).rejects.toThrow(BadGatewayException);
    });

    it('should throw BadGatewayException when product not found for stock change', async () => {
      const changeDto = { change: 10, reason: 'Stock added' };
      
      jest.spyOn(productRepo, 'findOne').mockResolvedValue(null);
      
      await expect(service.changeStock('999', changeDto)).rejects.toThrow(BadGatewayException);
    });
  });
});
