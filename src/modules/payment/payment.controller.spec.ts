import { PaymentStatus } from 'src/common/enums/generic.enum';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockPayment: PaymentEntity = {
    id: 1,
    amount: 100.0,
    paymentDate: new Date(),
    paymentMethod: 'credit_card',
    status: 'paid',
    invoice: null, // Assuming the relation isn't necessary for this test
  };

  const mockCreatePaymentDto: CreatePaymentDto = {
    invoiceId: 1,
    amount: 100.0,
    paymentDate: new Date(),
    paymentMethod: 'credit_card',
    status: PaymentStatus.SUCCESS,
  };

  const mockUpdatePaymentDto: UpdatePaymentDto = {
    amount: 150.0,
    paymentDate: new Date(),
    status: PaymentStatus.FAILED,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPayment),
            findAll: jest.fn().mockResolvedValue([mockPayment]),
            findById: jest.fn().mockResolvedValue(mockPayment),
            update: jest.fn().mockResolvedValue(mockPayment),
            delete: jest.fn().mockResolvedValue(true),
            handleFailedPayment: jest.fn().mockResolvedValue(mockPayment),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a new payment', async () => {
      const result = await controller.createPayment(mockCreatePaymentDto);

      expect(result).toEqual(mockPayment);
      expect(service.create).toHaveBeenCalledWith(mockCreatePaymentDto);
    });
  });

  describe('getAllPayments', () => {
    it('should return all payments', async () => {
      const result = await controller.getAllPayments();

      expect(result).toEqual([mockPayment]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getPaymentById', () => {
    it('should return a specific payment by ID', async () => {
      const result = await controller.getPaymentById(1);

      expect(result).toEqual(mockPayment);
      expect(service.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if payment is not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValueOnce(null);

      await expect(controller.getPaymentById(2)).rejects.toThrow(new NotFoundException(`Payment with ID 2 not found.`));
    });
  });

  describe('updatePayment', () => {
    it('should update the payment details', async () => {
      const result = await controller.updatePayment(1, mockUpdatePaymentDto);

      expect(result).toEqual(mockPayment);
      expect(service.update).toHaveBeenCalledWith(1, mockUpdatePaymentDto);
    });

    it('should throw NotFoundException if payment is not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValueOnce(null);

      await expect(controller.updatePayment(2, mockUpdatePaymentDto)).rejects.toThrow(
        new NotFoundException(`Payment with ID 2 not found.`),
      );
    });
  });

  describe('deletePayment', () => {
    it('should delete the payment', async () => {
      const result = await controller.deletePayment(1);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if payment is not found', async () => {
      jest.spyOn(service, 'delete').mockResolvedValueOnce(false);

      await expect(controller.deletePayment(2)).rejects.toThrow(new NotFoundException(`Payment with ID 2 not found.`));
    });
  });

  describe('handleFailedPayment', () => {
    it('should handle a failed payment and retry', async () => {
      const result = await controller.handleFailedPayment(1);

      expect(result).toEqual(mockPayment);
      expect(service.handleFailedPayment).toHaveBeenCalledWith(1);
    });
  });
});
