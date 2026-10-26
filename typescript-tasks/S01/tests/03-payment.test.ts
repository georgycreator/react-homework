import { describe, expect, it } from "vitest";
import { describePayment, total, type Payment } from "../src/03-payment.js";

const payments: Payment[] = [
    { kind: "cash", amount: 500 },
    { kind: "card", last4: "4417" },
    { kind: "transfer", iban: "DK50 0040 0440 1162 43" },
    { kind: "cash", amount: 120 },
];

describe("Задание 3. Платежи", () => {
    it("описывает каждый вид платежа по-своему", () => {
        const texts = payments.map(describePayment);
        expect(texts[0]).toContain("500");
        expect(texts[1]).toContain("4417");
        expect(texts[2]).toContain("DK50");
    });

    it("суммирует только наличные", () => {
        expect(total(payments)).toBe(620);
        expect(total([])).toBe(0);
    });

    it("не принимает платёж с чужой меткой", () => {
        // @ts-expect-error — такого варианта в Payment нет
        expect(() => describePayment({ kind: "bitcoin", amount: 1 })).toBeDefined();
    });
});
