import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, ParseUUIDPipe, ParseEnumPipe, UseGuards } from '@nestjs/common';
import { ContactStatus, UserRole } from '@prisma/client';
import { buildApiResponse } from '@shared/helpers/api-response.helper';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import type { PublicUser } from '@modules/auth/interfaces/auth.interfaces';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createContact(@Body() dto: CreateContactDto) {
    const contact = await this.contactsService.createContact(dto);
    return buildApiResponse('Message sent successfully', contact);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createContactAsUser(@CurrentUser() user: PublicUser, @Body() dto: CreateContactDto) {
    const contact = await this.contactsService.createContact(dto, user.id);
    return buildApiResponse('Message sent successfully', contact);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async listContacts(@Query('status', new ParseEnumPipe(ContactStatus)) status?: ContactStatus) {
    const contacts = await this.contactsService.listContacts({ status });
    return buildApiResponse('Contacts loaded successfully', contacts);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getContact(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const contact = await this.contactsService.getContactById(id);
    return buildApiResponse('Contact loaded successfully', contact);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async updateContact(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateContactDto,
  ) {
    const contact = await this.contactsService.updateContact(id, dto);
    return buildApiResponse('Contact updated successfully', contact);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @HttpCode(HttpStatus.OK)
  async deleteContact(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this.contactsService.deleteContact(id);
    return buildApiResponse('Contact deleted successfully', result);
  }
}

