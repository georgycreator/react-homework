import { describe, expect, it } from "vitest";
import { defaultRules, validateForm, type IFormData } from "../src/04-validation.js";

const valid: IFormData = { username: "denis", email: "d@example.com", age: 25 };

describe("Задание 4*. Правила валидации", () => {
    it("на корректных данных ошибок нет", () => {
        expect(validateForm(valid, defaultRules)).toEqual({});
    });

    it("сообщает только про непрошедшие поля", () => {
        const errors = validateForm({ ...valid, username: "  ", age: 0 }, defaultRules);
        expect(Object.keys(errors).sort()).toEqual(["age", "username"]);
        expect(errors.username).toContain("username");
        expect(errors.email).toBeUndefined();
    });

    it("не принимает правило для несуществующего поля", () => {
        // @ts-expect-error — nickname не входит в IFormData
        expect(() => validateForm(valid, { ...defaultRules, nickname: () => true })).toBeDefined();
    });
});
