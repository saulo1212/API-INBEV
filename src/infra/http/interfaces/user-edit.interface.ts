import { ApiProperty } from '@nestjs/swagger';

export class userEditInterface {
  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String, required: true })
  userLogin: string;

  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: Boolean })
  active: boolean;
}
