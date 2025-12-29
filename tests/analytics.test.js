import { createTestLink, createTestUser, removeTestLink, removeTestUser } from "./utils.js";
import supertest from "supertest";
import app from "../src/config/express.js";

describe('GET /api/analytics/overview', function () {

    let accessToken;

    beforeEach(async () => {
        await createTestLink();
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({ email: "test@gmail.com", password: "supersecret" });
        accessToken = login.body.data.accessToken;
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get analytics overview', async () => {
        const result = await supertest(app)
            .get('/api/analytics/overview')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(result.status).toBe(200);
        expect(result.body.data.total_clicks).toBeDefined();
        expect(result.body.data.unique_clicks).toBeDefined();
        expect(result.body.data.qr_clicks).toBeDefined();
        expect(result.body.data.previous).toBeDefined();
    });

    it('should reject without auth', async () => {
        const result = await supertest(app)
            .get('/api/analytics/overview');

        expect(result.status).toBe(401);
    });
});

describe('GET /api/analytics/clicks', function () {

    let accessToken;

    beforeEach(async () => {
        await createTestLink();
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({ email: "test@gmail.com", password: "supersecret" });
        accessToken = login.body.data.accessToken;
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get clicks data', async () => {
        const result = await supertest(app)
            .get('/api/analytics/clicks')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
    });
});

describe('GET /api/analytics/top-links', function () {

    let accessToken;

    beforeEach(async () => {
        await createTestLink();
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({ email: "test@gmail.com", password: "supersecret" });
        accessToken = login.body.data.accessToken;
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get top links', async () => {
        const result = await supertest(app)
            .get('/api/analytics/top-links')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
    });
});

describe('GET /api/analytics/referrers', function () {

    let accessToken;

    beforeEach(async () => {
        await createTestLink();
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({ email: "test@gmail.com", password: "supersecret" });
        accessToken = login.body.data.accessToken;
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get referrers', async () => {
        const result = await supertest(app)
            .get('/api/analytics/referrers')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
    });
});

describe('GET /api/analytics/devices', function () {

    let accessToken;

    beforeEach(async () => {
        await createTestLink();
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({ email: "test@gmail.com", password: "supersecret" });
        accessToken = login.body.data.accessToken;
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get devices', async () => {
        const result = await supertest(app)
            .get('/api/analytics/devices')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
    });
});

describe('GET /api/analytics/browsers', function () {

    let accessToken;

    beforeEach(async () => {
        await createTestLink();
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({ email: "test@gmail.com", password: "supersecret" });
        accessToken = login.body.data.accessToken;
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get browsers', async () => {
        const result = await supertest(app)
            .get('/api/analytics/browsers')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
    });
});

describe('GET /api/analytics/countries', function () {

    let accessToken;

    beforeEach(async () => {
        await createTestLink();
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({ email: "test@gmail.com", password: "supersecret" });
        accessToken = login.body.data.accessToken;
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get countries', async () => {
        const result = await supertest(app)
            .get('/api/analytics/countries')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
    });
});

describe('GET /api/analytics/cities', function () {

    let accessToken;

    beforeEach(async () => {
        await createTestLink();
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({ email: "test@gmail.com", password: "supersecret" });
        accessToken = login.body.data.accessToken;
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get cities', async () => {
        const result = await supertest(app)
            .get('/api/analytics/cities')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(result.status).toBe(200);
        expect(Array.isArray(result.body.data)).toBe(true);
    });
});
