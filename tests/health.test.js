import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { env } from "../src/config/index.js";

describe("Health API", () => {

    it("Responde con el estado de la API", async () => {
        const response = await request(app).get("/health");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('API funcionando');
        expect(response.body.payload.database).to.equal('connected');
    });

    it("Responde con error 503 si falla la conexióna la API", async () => {
        await mongoose.disconnect();
        try {
            const response = await request(app).get("/health");
    
            expect(response.status).to.equal(503);
            expect(response.body.status).to.equal('error');
            expect(response.body.error).to.equal('DATABASE_UNAVAILABLE');
        } finally {
            await mongoose.connect(env.mongodb_uri);
        }
    });
});


