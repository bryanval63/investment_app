import { Controller, Get } from '@nestjs/common';
import { IncomeTypeRefService } from './income-type-ref.service';

@Controller('income-types-ref')
export class IncomeTypeRefController {
  constructor(private readonly incomeTypeService: IncomeTypeRefService) {}

  // @Post()
  // create(@Body() createIncomeTypeDto: CreateIncomeTypeDto) {
  //   return this.incomeTypeService.create(createIncomeTypeDto);
  // }

  @Get()
  findAll() {
    return this.incomeTypeService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.incomeTypeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIncomeTypeDto: UpdateIncomeTypeDto) {
  //   return this.incomeTypeService.update(+id, updateIncomeTypeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.incomeTypeService.remove(+id);
  // }
}
