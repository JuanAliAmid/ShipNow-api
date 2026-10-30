import { expect } from "chai";
import request from "supertest";
import app from "../app.js";

describe("Health API", () => {

    it("Responde con el estado de la API", async() => {
        const response = await request(app).get("/health");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.message).to.equal('API funcionando');
    });
});


