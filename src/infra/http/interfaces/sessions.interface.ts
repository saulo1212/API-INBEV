import { ApiProperty } from '@nestjs/swagger'

export class sessionsInterface {
  @ApiProperty({ type: String, required: true })
  userLogin: string

  @ApiProperty({ type: String, required: true })
  password: string
}
