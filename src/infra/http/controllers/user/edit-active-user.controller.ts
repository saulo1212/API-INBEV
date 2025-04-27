import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
  } from '@nestjs/common'
  import {
    BodySchema,
    bodyValidationPipe,
  } from '../../validateSchema/status-active'
  import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger'
import { EditActiveUserUseCase } from '@/domain/aplication/application/use-cases/user/edit-active-user'
  
  @Controller('/user/:id/active')
  @ApiTags('User')
  export class EditActiveUserController {
    constructor(private editActive: EditActiveUserUseCase) {}
  
    @Put()
    @ApiBearerAuth()
    @HttpCode(204)
    @ApiBody({ 
        schema: {
          type: 'object',
          properties: {
            active: { type: 'boolean' },
          },
          required: ['active'],
        },
      })
    async handle(
      @Body(bodyValidationPipe) body: BodySchema,
      @Param('id') id: string,
    ) {
      const { active } = body
  
      const result = await this.editActive.execute({
        id,
        active,
      })
  
      if (result.isLeft()) {
        throw new BadRequestException()
      }
    }
  }
  