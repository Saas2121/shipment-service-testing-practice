import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShipmentsService } from './shipments.service';
import { ShipmentRulesService } from './shipment-rules.service';
import { ShipmentEntity } from './entities/shipment.entity';

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
    // mock del repositorio
    repository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    // mock del servicio
    rulesService = {
      ensureCanBeDispatched: jest.fn(),
    };

    // Testeado
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

  // caso 1 
    expect(service).toBeDefined();
  });
});