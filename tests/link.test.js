import {clearLinkTable, createTestUser, removeTestUser} from "./utils.js";
import supertest from "supertest";
import app from "../src/app.js";

describe('POST /api/links', function () {

    beforeEach(async () => {
        await createTestUser();
        await clearLinkTable();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can create short link for not auth user', async () => {
        const result = await supertest(app)
            .post('/api/links')
            .send({
                long_url: 'https://riakgu.com/',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.long_url).toBe("https://riakgu.com/");
        expect(result.body.data.short_code).toBeDefined();
        expect(result.body.data.user_id).toBe(null);
        expect(result.body.data.title).toBe(null);
        expect(result.body.data.expired_at).toBe(null);
        expect(result.body.data.has_password).toBe(false);
    });

    it('should reject if not auth user add extra field', async () => {
        const result = await supertest(app)
            .post('/api/links')
            .send({
                long_url: 'https://riakgu.com/',
                short_code: 'riakgu',
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should can create short link for auth user', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const result = await supertest(app)
            .post('/api/links')
            .send({
                long_url: 'https://riakgu.com/',
                short_code: 'riakgu',
                title: 'riakgu title',
                password: 'supersecret',
            })
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(result.status).toBe(200);
        expect(result.body.data.long_url).toBe("https://riakgu.com/");
        expect(result.body.data.short_code).toBe('riakgu');
        expect(result.body.data.user_id).toBeDefined();
        expect(result.body.data.title).toBe('riakgu title');
        expect(result.body.data.expired_at).toBe(null);
        expect(result.body.data.has_password).toBe(true);
    });
})

describe('GET /api/links/:shortCode', function () {

    beforeEach(async () => {
        await createTestUser();
        await clearLinkTable();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get detail link', async () => {
        const link = await supertest(app)
            .post('/api/links')
            .send({
                long_url: 'https://riakgu.com/',
            });

        const result = await supertest(app)
            .get(`/api/links/${link.body.data.short_code}`)

        expect(result.status).toBe(200);
        expect(result.body.data.long_url).toBe("https://riakgu.com/");
        expect(result.body.data.short_code).toBe(link.body.data.short_code);
        expect(result.body.data.user_id).toBe(null);
        expect(result.body.data.title).toBe(null);
        expect(result.body.data.expired_at).toBe(null);
        expect(result.body.data.has_password).toBe(false);
        expect(result.body.data.id).toBeDefined();
    });

    it('should reject if short code not found', async () => {
        const result = await supertest(app)
            .get(`/api/links/gftrdtr`)

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });

    it('should can get detail link with password', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const link = await supertest(app)
            .post('/api/links')
            .send({
                long_url: 'https://riakgu.com/',
                password: 'supersecret',
            })
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        const result = await supertest(app)
            .get(`/api/links/${link.body.data.short_code}?password=supersecret`);

        expect(result.status).toBe(200);
        expect(result.body.data.long_url).toBe("https://riakgu.com/");
        expect(result.body.data.short_code).toBe(link.body.data.short_code);
        expect(result.body.data.user_id).toBeDefined();
        expect(result.body.data.title).toBe(null);
        expect(result.body.data.expired_at).toBe(null);
        expect(result.body.data.has_password).toBe(true);
        expect(result.body.data.id).toBeDefined();
    });
})