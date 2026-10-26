import { describe, expect, it } from "vitest";
import { statusMessage, type Status } from "../src/01-status.js";

describe("Задание 1. Статусы", () => {
    it("возвращает разное сообщение на каждый статус", () => {
        const all: Status[] = ["idle", "loading", "success", "error"];
        const messages = all.map(statusMessage);
        expect(messages.every((m) => m.length > 0)).toBe(true);
        expect(new Set(messages).size).toBe(all.length);
    });

    it("не принимает статус, которого нет в объединении", () => {
        // @ts-expect-error — "done" не входит в Status
        expect(() => statusMessage("done")).toBeDefined();
    });
});
