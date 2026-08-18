import { Controller, Get } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Public()
  @Get()
  findAll() {
    return this.genresService.findAll();
  }
}
