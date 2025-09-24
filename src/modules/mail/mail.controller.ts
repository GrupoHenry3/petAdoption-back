import { Controller, Post, Param, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('user')
  userAdoptionApplication() {
    return this.mailService.userAdoptionConfirmation(
      'name@name.com',
      'John Doe',
      'adasdasd',
    );
  }

  @Post('shelter')
  sendMail() {
    return this.mailService.shelterAdoptionRequest(
      'name@name.com',
      'Animal Sanctuary',
      'adasdasd',
    );
  }
}
