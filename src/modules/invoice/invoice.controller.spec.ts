import { InvoiceStatus } from 'src/common/enums/generic.enum';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoiceController } from './invoice.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  const mockInvoice: InvoiceEntity = {
    id: 1,
    amount: 100.0,
    issueDate: new Date(),
    dueDate: new Date(),
    paymentDate: null,
    status: 'pending',
    customer: null,
    subscriptionPlan: null,
    payments: [],
  };

  const mockCreateInvoiceDto: CreateInvoiceDto = {
    customerId: 1,
    subscriptionPlanId: 1,
    amount: 100.0,
    issueDate: new Date(),
    paymentDate: new Date(),
    dueDate: new Date(),
    status: InvoiceStatus.PENDING,
  };

  const mockUpdateInvoiceDto: UpdateInvoiceDto = {
    amount: 150.0,
    dueDate: new Date(),
    status: InvoiceStatus.PAID,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockInvoice),
            findAll: jest.fn().mockResolvedValue([mockInvoice]),
            findById: jest.fn().mockResolvedValue(mockInvoice),
            update: jest.fn().mockResolvedValue(mockInvoice),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create a new invoice', async () => {
      const result = await controller.createInvoice(mockCreateInvoiceDto);

      expect(result).toEqual(mockInvoice);
      expect(service.create).toHaveBeenCalledWith(mockCreateInvoiceDto);
    });
  });

  describe('getAllInvoices', () => {
    it('should return all invoices', async () => {
      const result = await controller.getAllInvoices();

      expect(result).toEqual([mockInvoice]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getInvoiceById', () => {
    it('should return a specific invoice by ID', async () => {
      const result = await controller.getInvoiceById(1);

      expect(result).toEqual(mockInvoice);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if invoice is not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      await expect(controller.getInvoiceById(2)).rejects.toThrow(new NotFoundException(`Invoice with ID 2 not found.`));
    });
  });

  describe('updateInvoice', () => {
    it('should update the invoice details', async () => {
      const result = await controller.updateInvoice(1, mockUpdateInvoiceDto);

      expect(result).toEqual(mockInvoice);
      expect(service.update).toHaveBeenCalledWith(1, mockUpdateInvoiceDto);
    });

    it('should throw NotFoundException if invoice is not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce(null);

      await expect(controller.updateInvoice(2, mockUpdateInvoiceDto)).rejects.toThrow(
        new NotFoundException(`Invoice with ID 2 not found.`),
      );
    });
  });

  describe('deleteInvoice', () => {
    it('should delete the invoice', async () => {
      const result = await controller.deleteInvoice(1);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if invoice is not found', async () => {
      jest.spyOn(service, 'delete').mockResolvedValueOnce(false);

      await expect(controller.deleteInvoice(2)).rejects.toThrow(new NotFoundException(`Invoice with ID 2 not found.`));
    });
  });
});
