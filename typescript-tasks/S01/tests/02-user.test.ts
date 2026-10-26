import { describe, expect, it } from "vitest";
import { describeUser, type User } from "../src/02-user.js";

const base: User = {
    name: "Денис",
    age: 25,
    hobbies: ["чтение", "спорт"],
    contact: { email: "denis@example.com" },
};

describe("Задание 2. Карточка пользователя", () => {
    it("подставляет имя, возраст и хобби", () => {
        const text = describeUser(base);
        expect(text).toContain("Денис");
        expect(text).toContain("25");
        expect(text).toContain("чтение");
    });

    it("не пишет undefined, если возраст не указан", () => {
        const { age, ...withoutAge } = base;
        expect(describeUser(withoutAge)).not.toContain("undefined");
    });

    it("отдельно обрабатывает пустой список хобби", () => {
        expect(describeUser({ ...base, hobbies: [] })).not.toContain("Хобби: .");
    });

    it("различает телефон и почту", () => {
        const byPhone = describeUser({ ...base, contact: { phone: "+7900" } });
        expect(byPhone).toContain("+7900");
        expect(byPhone).not.toContain("@");
    });

    it("не принимает контакт другой формы", () => {
        // @ts-expect-error — в contact нет варианта с telegram
        expect(() => describeUser({ ...base, contact: { telegram: "@d" } })).toBeDefined();
    });
});
