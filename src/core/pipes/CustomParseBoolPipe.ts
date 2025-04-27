import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'

@Injectable()
export class CustomParseBoolPipe
  implements PipeTransform<string | boolean, boolean | undefined>
{
  transform(
    value: string | boolean,
    metadata: ArgumentMetadata,
  ): boolean | undefined {
    if (value === 'true' || value === 'TRUE') {
      return true
    } else if (value === 'false' || value === 'FALSE') {
      return false
    } else {
      return undefined
    }
  }
}
