import { createTestLink, removeTestLink } from "./utils.js";
import supertest from "supertest";
import app from "../src/app.js";

describe('GET /:shortCode', function () {

    beforeEach(async () => {
        await createTestLink();
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can redirect link', async () => {
        const result = await supertest(app)
            .get('/test')

        expect(result.status).toBe(301);
        expect(result.headers.location).toBe('https://riakgu.com');
    });

    it('should reject if short code not found', async () => {
        const result = await supertest(app)
            .get(`/gftrdtr`)

        expect(result.status).toBe(302);
        expect(result.headers.location).toContain('/not-found');
    });


    it('should reject if short code required password', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const link = await supertest(app)
            .post('/api/links')
            .send({
                long_url: 'https://riakgu.com',
                password: 'supersecret',
            })
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        const result = await supertest(app)
            .get(`/${link.body.data.short_code}`);

        expect(result.status).toBe(302);
        expect(result.headers.location).toContain('/p/');
    });
})

describe('POST /api/links/:shortCode/verify', function () {

    beforeEach(async () => {
        await createTestLink();
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get detail link if password correct', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const link = await supertest(app)
            .post('/api/links')
            .send({
                long_url: 'https://riakgu.com',
                password: 'supersecret',
            })
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        const result = await supertest(app)
            .post(`/api/links/${link.body.data.short_code}/verify`)
            .send({
                password: 'supersecret',
            })

        expect(result.status).toBe(200);
        expect(result.body.data.long_url).toBe("https://riakgu.com");
    });

    it('should reject if password is wrong', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const link = await supertest(app)
            .post('/api/links')
            .send({
                long_url: 'https://riakgu.com',
                password: 'supersecret',
            })
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        const result = await supertest(app)
            .post(`/api/links/${link.body.data.short_code}/verify`)
            .send({
                password: 'xxxxxx',
            })

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
})