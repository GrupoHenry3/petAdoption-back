import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async signUpConfirmation(name: string, email: string) {
    await this.mailerService.sendMail({
      to: email,
      from: `Pet Adoption ${process.env.GMAIL_USER}`,
      subject: 'Welcome to Pet Adoption!',
      template: 'signupConfirmation',
      context: {
        userName: name,
      },
    });
  }

  async shelterAdoptionRequest(shelterEmail: string, shelterName: string, requestId: string) {
    await this.mailerService.sendMail({
      to: shelterEmail,
      from: `Pet Adoption ${process.env.GMAIL_USER}`,
      subject: 'New adoption application',
      template: 'shelterAdoptionApplication',
      context: {
        shelterName: shelterName,
        requestId: requestId,
      },
    });
  }

  async userAdoptionConfirmation(userEmail: string, userName: string, requestId: string) {
    await this.mailerService.sendMail({
      to: userEmail,
      from: `Pet Adoption ${process.env.GMAIL_USER}`,
      subject: 'Adoption application',
      template: 'userAdoptionApplication',
      context: {
        userName: userName,
        requestId: requestId,
      },
    });
  }

  async shelterDonationConfirmation(
    shelterName: string,
    shelterEmail: string,
    userName: string,
    donationId: string,
    donationAmount: number,
    donationMessage: string,
  ) {
    await this.mailerService.sendMail({
      to: shelterEmail,
      from: `Pet Adoption ${process.env.GMAIL_USER}`,
      subject: 'Donation received',
      template: 'shelterDonationConfirmation',
      context: {
        shelterName: shelterName,
        userName: userName,
        donationId: donationId,
        donationAmount: donationAmount,
        donationMessage: donationMessage,
      },
    });
  }

  async userDonationConfirmation(
    userEmail: string,
    userName: string,
    shelterName: string,
    donationAmount: number,
  ) {
    await this.mailerService.sendMail({
      to: userEmail,
      from: `Pet Adoption ${process.env.GMAIL_USER}`,
      subject: 'Donation sent',
      template: 'userDonationConfirmation',
      context: {
        shelterName: shelterName,
        userName: userName,
        donationAmount: donationAmount,
      },
    });
  }

  async paymentFailedNotification(
    userEmail: string,
    userName: string,
    shelterName: string,
    donationAmount: number,
    errorReason: string,
  ) {
    await this.mailerService.sendMail({
      to: userEmail,
      from: `Pet Adoption ${process.env.GMAIL_USER}`,
      subject: 'Payment failed - Donation not processed',
      template: 'paymentFailed',
      context: {
        userName: userName,
        shelterName: shelterName,
        donationAmount: donationAmount,
        errorReason: errorReason,
        donationDate: new Date().toLocaleDateString('es-ES'),
      },
    });
  }
}
