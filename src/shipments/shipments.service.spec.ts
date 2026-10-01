import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentRulesService } from './shipment-rules.service';
import { ShipmentEntity } from './entities/shipment.entity';
import { ShipmentStatus } from './shipment-status.enum';

describe('ShipmentsService', () => {
  let service: ShipmentsService;
  let repository: {
    find: jest.Mock;
    findOneBy: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let rulesService: {
    ensureCanBeDispatched: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    rulesService = {
      ensureCanBeDispatched: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipmentsService,
        {
          provide: getRepositoryToken(ShipmentEntity),
          useValue: repository,
        },
        {
          provide: ShipmentRulesService,
          useValue: rulesService,
        },
      ],
    }).compile();

    service = module.get<ShipmentsService>(ShipmentsService);

    jest.clearAllMocks();
  });

 
  it('is defined', () => {
    expect(service).toBeDefined();
  });

  
  it('returns all shipments', async () => {
    // Arrange
    const mockShipments = [
      { id: 1, trackingCode: 'SHIP-1', destination: 'Cali', status: ShipmentStatus.CREATED },
      { id: 2, trackingCode: 'SHIP-2', destination: 'Medellín', status: ShipmentStatus.DISPATCHED },
    ];
    repository.find.mockResolvedValue(mockShipments);

    
    const result = await service.findAll();

    
    expect(result).toEqual(mockShipments);
    expect(repository.find).toHaveBeenCalledTimes(1);
  });


  it('returns a shipment when the id exists', async () => {
    // Arrange
    const mockShipment = {
      id: 7,
      trackingCode: 'SHIP-7',
      destination: 'Bogotá',
      status: ShipmentStatus.CREATED,
    };
    repository.findOneBy.mockResolvedValue(mockShipment);

    
    const result = await service.findOne(7);

   
    expect(result).toEqual(mockShipment);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 7 });
  });

  // Caso 4 
  it('throws NotFoundException when the id does not exist', async () => {
    // Arrange: TypeORM retorna null si no encuentra el registro
    repository.findOneBy.mockResolvedValue(null);

    
    await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
  });
});