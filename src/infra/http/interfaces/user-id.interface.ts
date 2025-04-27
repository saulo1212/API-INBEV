import { ApiProperty } from '@nestjs/swagger';

export class userIdInterface {
  @ApiProperty({ type: String, required: true })
  id: string;
}
