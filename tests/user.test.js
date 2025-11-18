import {clearLinkTable, createTestUser, removeTestUser} from "./utils.js";
import supertest from "supertest";
import app from "../src/app.js";

describe('POST /api/users/me', function () {

    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update user', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const result = await supertest(app)
            .post('/api/users/me')
            .send({
                name: 'test update',
            })
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.email).toBe('test@gmail.com');
        expect(result.body.data.name).toBe("test update");
    });

    it('should reject if name empty', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const result = await supertest(app)
            .post('/api/users/me')
            .send({
                name: '',
            })
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();

    });
})

describe('POST /api/users/me/password', function () {

    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update password', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const result = await supertest(app)
            .post('/api/users/me/password')
            .send({
                old_password: 'supersecret',
                new_password: 'newpassword',
            })
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        const loginAgain = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "newpassword"
            });

        expect(result.status).toBe(200);
        expect(result.body.message).toBe('Password updated successfully');
        expect(loginAgain.status).toBe(200);
    });

    it('should reject if old password dont match', async () => {
        const login = await supertest(app)
            .post('/api/auth/login')
            .send({
                email: "test@gmail.com",
                password: "supersecret"
            });

        const result = await supertest(app)
            .post('/api/users/me/password')
            .send({
                old_password: 'randomrandom',
                new_password: 'newpassword',
            })
            .set('Authorization', `Bearer ${login.body.data.accessToken}`);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();

    });
})