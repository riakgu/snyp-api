import supertest from "supertest";
import app from "../src/app.js";
import {createTestUser, removeTestUser} from "./utils.js";
import {logger} from "../src/utils/logging.js";

describe('POST /api/auth/register', function () {

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can register new user', async () => {
        const result = await supertest(app)
            .post('/api/auth/register')
            .send({
                email: 'test@gmail.com',
                password: 'supersecret',
                name: 'test'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe("test@gmail.com");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(app)
            .post('/api/auth/register')
            .send({
                email: '',
                password: '',
                name: ''
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if email already registered', async () => {
        let result = await supertest(app)
            .post('/api/auth/register')
            .send({
                email: 'test@gmail.com',
                password: 'supersecret',
                name: 'test'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBe("test@gmail.com");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(app)
            .post('/api/auth/register')
            .send({
                email: 'test@gmail.com',
                password: 'supersecret',
                name: 'test'
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
})

describe('POST /api/auth/login', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.accessToken).toBeDefined();
        expect(result.body.data.refreshToken).toBeDefined();
    });

    it('should reject login if request is invalid', async () => {
        const result = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "",
                password: ""
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if password is wrong', async () => {
        const result = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "salahsalah"
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if email is wrong', async () => {
        const result = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "salah@gmail.com",
                password: "salah"
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/auth/refresh', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can refresh token', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const result = await supertest(app)
            .post('/api/auth/refresh')
            .send({
                refreshToken: login.body.data.refreshToken,
            });

        expect(result.status).toBe(200);
        expect(result.body.data.accessToken).toBeDefined();
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(app)
            .post('/api/auth/refresh')
            .send({
                refreshToken: "",
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is wrong', async () => {
        const result = await supertest(app)
            .post('/api/auth/refresh')
            .send({
                refreshToken: "salah",
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/auth/logout', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can logout', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const result = await supertest(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('Logged out successfully');
    });

    it('should reject if token not provided', async () => {
        const result = await supertest(app)
            .post('/api/auth/logout');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if token is invalid', async () => {
        const result = await supertest(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer salah`);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});