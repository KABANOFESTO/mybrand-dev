import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getAppInfo: jest.fn().mockReturnValue({ name: 'mybrand' }),
            getHealth: jest.fn().mockReturnValue({ status: 'ok' }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return app info', () => {
      expect(appController.getAppInfo()).toEqual({ name: 'mybrand' });
    });
  });
});
