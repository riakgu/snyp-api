import {clearLinkTable, createTestLink, createTestUser, removeTestLink, removeTestUser} from "./utils.js";
import supertest from "supertest";
import app from "../src/app.js";

describe('POST /api/links/:shortCode/archive', function () {

    beforeEach(async () => {
        await createTestLink();
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can archive link', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const result = await supertest(app)
            .post('/api/links/test/archive')
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Link has been archived successfully");
    });

})

describe('PATCH /api/links/:shortCode/archive', function () {

    beforeEach(async () => {
        await createTestLink();
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can unarchive link', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const archive = await supertest(app)
            .post('/api/links/test/archive')
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(archive.status).toBe(200);
        expect(archive.body.message).toBe("Link has been archived successfully");

        const result = await supertest(app)
            .patch('/api/links/test/archive')
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("Link has been unarchived successfully");
    });

})

describe('GET /api/links/archived', function () {

    beforeEach(async () => {
        await createTestLink();
    });

    afterEach(async () => {
        await removeTestLink();
    });

    it('should can get archived link', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const archive = await supertest(app)
            .post('/api/links/test/archive')
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(archive.status).toBe(200);
        expect(archive.body.message).toBe("Link has been archived successfully");

        const result = await supertest(app)
            .get('/api/links/archived')
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(result.status).toBe(200);
        expect(result.body.data).toHaveLength(1);
        expect(result.body.data[0].short_code).toBe('test');
    });

})