import { ApiProperty } from '@nestjs/swagger';

export class userHandleInterface {
  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String, required: true })
  userLogin: string;

  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: Boolean })
  active: boolean;

  @ApiProperty({ type: String, required: true })
  password: string;
}
