import {
  IsString,
  IsDefined,
  IsOptional,
  IsEmail,
  IsObject,
} from "class-validator";

export class SendEmailDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsDefined()
  @IsEmail({}, { each: true })
  @IsOptional()
  to?: string[];

  @IsDefined()
  @IsEmail({}, { each: true })
  @IsOptional()
  bcc?: string[];

  @IsOptional()
  @IsString()
  subject?: string;

  @IsObject()
  @IsDefined()
  templateData: object;

  @IsString()
  @IsDefined()
  templateName: string;
}
