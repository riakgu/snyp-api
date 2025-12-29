import { createTestLink, removeTestLink } from "./utils.js";
import supertest from "supertest";
import app from "../src/config/express.js";

describe('GET /api/links/:shortCode/stats', function () {

    beforeEach(async () => {
        await createTestLink();
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get link stats', async () => {
        const result = await supertest(app)
            .get('/api/links/test/stats')

        expect(result.status).toBe(200);
        expect(result.body.data.total_clicks).toBeDefined();
        expect(result.body.data.unique_clicks).toBeDefined();
        expect(result.body.data.qr_clicks).toBeDefined();
    });

    it('should reject if short code not found', async () => {
        const result = await supertest(app)
            .get(`/api/links/retrtert/stats`)

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
})