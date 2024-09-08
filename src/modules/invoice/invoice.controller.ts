import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, NotFoundException, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceEntity } from './entities/invoice.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { InvoiceService } from './invoice.service';

@ApiTags('Invoices')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }


  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully.' })
  public async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoiceService.create(createInvoiceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all invoices' })
  @ApiResponse({ status: 200, description: 'Returned all invoices successfully', type: [InvoiceEntity] })
  async getAllInvoices(): Promise<InvoiceEntity[]> {
    return await this.invoiceService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully', type: InvoiceEntity })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Invoice ID' })
  async getInvoiceById(@Param('id') id: number): Promise<InvoiceEntity> {
    const invoice = await this.invoiceService.findById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found.`);
    }
    return invoice;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update invoice details' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully.' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Invoice ID' })
  @ApiBody({ type: UpdateInvoiceDto })
  async updateInvoice(@Param('id') id: number, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    const updatedInvoice = await this.invoiceService.update(id, updateInvoiceDto);
    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found.`);
    }
    return updatedInvoice;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiResponse({ status: 204, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiParam({ name: 'id', type: 'number', description: 'Invoice ID' })
  async deleteInvoice(@Param('id') id: number) {
    const result = await this.invoiceService.delete(id);
    if (!result) {
      throw new NotFoundException(`Invoice with ID ${id} not found.`);
    }
  }
}
