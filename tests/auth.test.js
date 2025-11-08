import supertest from "supertest";
import app from "../src/app.js";
import {removeTestUser} from "./utils.js";

describe('POST /api/auth', function () {

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