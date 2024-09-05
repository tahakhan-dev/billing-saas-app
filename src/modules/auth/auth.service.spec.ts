import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from '../customer/customer.service';

describe('AuthService', () => {
    let service: AuthService;
    const mockUsersService = {
        findOne: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: CustomerService,
                    useValue: mockUsersService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // Example: Validate user
    it('should validate a user', async () => {
        const user = { /*...user data...*/ };
        mockUsersService.findOne.mockResolvedValue(user);

        // expect(await service.validateUser('username', 'password')).toEqual(user);
        expect(mockUsersService.findOne).toHaveBeenCalledWith({ username: 'username' });
    });

    // More test cases for login, token generation...
});