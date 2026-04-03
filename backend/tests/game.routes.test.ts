import request from "supertest";
import app from "../src/app";
import * as wordService from "../src/services/word.service";

const KNOWN_WORD = "crane";
const INVALID_ID = "not-a-guid";
const UNKNOWN_ID = "00000000-0000-0000-0000-000000000000";

beforeEach(() => {
    jest.spyOn(wordService, "getRandomWord").mockReturnValue(KNOWN_WORD);
    jest.spyOn(wordService, "isValidWord").mockReturnValue(true);
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("POST /game", () => {
    it("creates a new game and returns 201", async () => {
        const res = await request(app).post("/game");
        expect(res.status).toBe(201);
    });
});

describe("GET /game/:id", () => {
    it("returns 400 for a non-GUID id", async () => {
        const res = await request(app).get(`/game/${INVALID_ID}`);
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/guid/i);
    });

    it("returns 404 for an unknown game id", async () => {
        const res = await request(app).get(`/game/${UNKNOWN_ID}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Game not found");
    });

    it("returns the game state for a valid id", async () => {
        const created = await request(app).post("/game");
        const res = await request(app).get(`/game/${created.body.id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(created.body.id);
    });
});

describe("POST /game/:id/guess", () => {
    it("returns 400 for a non-GUID id", async () => {
        const res = await request(app)
            .post(`/game/${INVALID_ID}/guess`)
            .send({ word: KNOWN_WORD });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/guid/i);
    });

    it("returns 404 for an unknown game id", async () => {
        const res = await request(app)
            .post(`/game/${UNKNOWN_ID}/guess`)
            .send({ word: KNOWN_WORD });
        expect(res.status).toBe(404);
    });

    it("returns 400 when word is missing from the body", async () => {
        const created = await request(app).post("/game");
        const res = await request(app)
            .post(`/game/${created.body.id}/guess`)
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/word/i);
    });

    it("returns 400 for an invalid word", async () => {
        jest.spyOn(wordService, "isValidWord").mockReturnValue(false);
        const created = await request(app).post("/game");
        const res = await request(app)
            .post(`/game/${created.body.id}/guess`)
            .send({ word: "zzzzz" });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Invalid word");
    });

    it("accepts a valid guess and returns updated game state", async () => {
        const created = await request(app).post("/game");
        const res = await request(app)
            .post(`/game/${created.body.id}/guess`)
            .send({ word: "audio" });
        expect(res.status).toBe(200);
        expect(res.body.guesses).toHaveLength(1);
        expect(res.body.guesses[0].word).toBe("audio");
    });

    it("reveals the target word when the correct guess is submitted", async () => {
        const created = await request(app).post("/game");
        const res = await request(app)
            .post(`/game/${created.body.id}/guess`)
            .send({ word: KNOWN_WORD });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("complete");
        expect(res.body.targetWord).toBe(KNOWN_WORD);
    });
});
