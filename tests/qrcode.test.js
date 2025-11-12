import {createTestLink, removeTestLink} from "./utils.js";
import supertest from "supertest";
import app from "../src/app.js";

describe('GET /api/links/:shortCode/qr', function () {

    beforeEach(async () => {
        await createTestLink();
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get qr code', async () => {
        const result = await supertest(app)
            .get('/api/links/test/qr')

        expect(result.status).toBe(200);
        expect(result.headers['content-type']).toBe('image/png');
        expect(result.headers['cache-control']).toBe('public, max-age=604800');
    });

    it('should reject if short code not found', async () => {
        const result = await supertest(app)
            .get(`/api/links/retrtert/qr`)

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
})

describe('GET /api/links/:shortCode/qr/download', function () {

    beforeEach(async () => {
        await createTestLink();
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can download qr code', async () => {
        const result = await supertest(app)
            .get('/api/links/test/qr/download')

        expect(result.status).toBe(200);
        expect(result.headers['content-disposition']).toBe('attachment; filename="qr-test.png"');
        expect(result.headers['content-type']).toBe('image/png');
    });

    it('should reject if short code not found', async () => {
        const result = await supertest(app)
            .get(`/api/links/retrtert/qr/download`)

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
})