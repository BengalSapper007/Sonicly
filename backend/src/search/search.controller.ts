import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Public()
  @Get()
  search(
    @Query('q') q: string,
    @Query('type') type: 'all' | 'songs' | 'artists' | 'albums' | 'playlists' = 'all',
  ) {
    return this.searchService.search(q, type);
  }
}
