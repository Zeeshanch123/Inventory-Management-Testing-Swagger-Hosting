import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierService } from './supplier.service';
import { Supplier } from './entity/supplier.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SupplierService', () => {
  let service: SupplierService;
  let supplierRepo: Repository<Supplier>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
    supplierRepo = module.get<Repository<Supplier>>(getRepositoryToken(Supplier));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have repository injected', () => {
    expect(supplierRepo).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all suppliers', async () => {
      const mockSuppliers = [
        { id: '1', name: 'Supplier 1', email: 'supplier1@example.com' },
        { id: '2', name: 'Supplier 2', email: 'supplier2@example.com' },
      ];
      
      jest.spyOn(supplierRepo, 'find').mockResolvedValue(mockSuppliers as any);
      
      const result = await service.findAll();
      expect(result.data).toEqual(mockSuppliers);
      expect(result.message).toBe('Fetched all suppliers successfully');
    });

    it('should handle errors in findAll', async () => {
      jest.spyOn(supplierRepo, 'find').mockRejectedValue(new Error('Database error'));
      
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a single supplier', async () => {
      const mockSupplier = { id: '1', name: 'Supplier 1', email: 'supplier1@example.com' };
      
      jest.spyOn(supplierRepo, 'findOne').mockResolvedValue(mockSupplier as any);
      
      const result = await service.findOne('1');
      expect(result.data).toEqual(mockSupplier);
      expect(result.message).toBe('Fetched supplier successfully');
    });

    it('should throw BadRequestException when supplier not found', async () => {
      jest.spyOn(supplierRepo, 'findOne').mockResolvedValue(null);
      
      await expect(service.findOne('999')).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new supplier', async () => {
      const createDto = { 
        name: 'New Supplier', 
        contact_email: 'newsupplier@example.com'
      };
      const mockSupplier = { id: '1', ...createDto };
      
      jest.spyOn(supplierRepo, 'create').mockReturnValue(mockSupplier as any);
      jest.spyOn(supplierRepo, 'save').mockResolvedValue(mockSupplier as any);
      
      const result = await service.create(createDto);
      expect(result.data).toEqual(mockSupplier);
      expect(result.message).toBe('Supplier created successfully');
    });

    it('should handle errors in create', async () => {
      const createDto = { 
        name: 'New Supplier', 
        contact_email: 'newsupplier@example.com'
      };
      
      jest.spyOn(supplierRepo, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });
      
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update an existing supplier', async () => {
      const updateDto = { name: 'Updated Supplier', email: 'updated@example.com' };
      const mockSupplier = { id: '1', name: 'Updated Supplier', email: 'updated@example.com' };
      
      jest.spyOn(supplierRepo, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(supplierRepo, 'findOne').mockResolvedValue(mockSupplier as any);
      
      const result = await service.update('1', updateDto);
      expect(result.data).toEqual(mockSupplier);
      expect(result.message).toBe('Supplier updated successfully');
    });

    it('should throw BadRequestException when supplier not found for update', async () => {
      const updateDto = { name: 'Updated Supplier' };
      
      jest.spyOn(supplierRepo, 'update').mockResolvedValue({ affected: 0 } as any);
      
      await expect(service.update('999', updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an existing supplier', async () => {
      const mockSupplier = { id: '1', name: 'Supplier 1', email: 'supplier1@example.com' };
      
      jest.spyOn(supplierRepo, 'findOne').mockResolvedValue(mockSupplier as any);
      jest.spyOn(supplierRepo, 'remove').mockResolvedValue(mockSupplier as any);
      
      const result = await service.remove('1');
      expect(result.data).toBeNull();
      expect(result.message).toBe('Supplier removed successfully');
    });

    it('should throw BadRequestException when supplier not found for removal', async () => {
      jest.spyOn(supplierRepo, 'findOne').mockResolvedValue(null);
      
      await expect(service.remove('999')).rejects.toThrow(BadRequestException);
    });
  });
});
