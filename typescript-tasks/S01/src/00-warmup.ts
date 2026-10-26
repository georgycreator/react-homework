// Задание 0. Разминка (10 минут)
//
// В каждой строке ниже ошибка типизации. Исправьте так, чтобы
//     npm run warmup
// не выдавал ни одной ошибки, а код остался осмысленным.
//
// Нельзя: any, as, ! и @ts-ignore. Менять можно и типы, и сам код.

// 1
let count: number = 42; //let count: number = "42"; а должно быть число 

// 2
const ids: number[] = [1, 2, 3]; // const ids: number[] = [1, 2, "3"]; опять символ вместо числа

// 3
function len(x: string | null): number {
    return x === null ? 0 : x.length;
}

// 4
const user: { name: string; age?: number } = { name: "Аня" }; // сделали поле необязательным

// 5
function first(xs: string[]): string | undefined { // так как может быть undefined 
    return xs[0];
}

// 6
const normalized = "ON".toLowerCase();
const label: "on" | "off" = normalized === "on" ? "on" : "off";

// 7
function area(width: number, height: number): number {
    const value = width * height;
    return value;
}

export { count, ids, len, user, first, label, area };
