import { Controller, Get } from '@nestjs/common';
import { BaseController } from './base.controller';

@Controller()
export class AppController extends BaseController {
  constructor() {
    super();
  }

  @Get()
  getHello() {
    return this.success({
      name: 'Lumes AI API',
      version: '1.0.0',
      author: 'Lumes',
      description: 'Lumes AI API',
      docs: '/docs',
    }, 'Lumes AI API OFICIAL');
  }
}
