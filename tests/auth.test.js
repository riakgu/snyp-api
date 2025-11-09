import supertest from "supertest";
import app from "../src/app.js";
import {createTestUser, removeTestUser} from "./utils.js";

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