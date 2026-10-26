// Задание 3. Платежи (20 минут)
//
// 1. Реализуйте describePayment: switch по метке kind.
// 2. Закройте switch проверкой полноты через never.
// 3. Реализуйте total — сумма только наличных платежей.
// 4. Добавьте четвёртый вариант оплаты и посмотрите, где компилятор
//    покажет незакрытые места.



//  Добавлен четвёртый вариант — "crypto". 
export type Payment =
  | { kind: "card"; last4: string }
  | { kind: "cash"; amount: number }
  | { kind: "transfer"; iban: string }
  | { kind: "crypto"; wallet: string };
 
//    Замыкает switch, если все case разобраны, payment в default-ветке
//    сужается до never — вызов компилируется. Если какой-то вариант
//    забыт, компилятор укажет ошибку именно в месте вызова assertNever
export function assertNever(value: never): never {
  throw new Error("Необработанный способ оплаты: " + JSON.stringify(value));
}
 
export function describePayment(payment: Payment): string {
  switch (payment.kind) {
    case "card":
      return `Карта  ${payment.last4}`;
    case "cash":
      return `Наличные: ${payment.amount}`;
    case "transfer":
      return `Перевод по IBAN ${payment.iban}`;
    case "crypto":
      return `Криптокошелёк ${payment.wallet}`;
    default:
      return assertNever(payment);
  }
}
 
//    Суммируем только наличные — сравнение payment.kind === "cash"
//    сужает тип payment внутри тернарника до варианта cash,
//    поэтому payment.amount доступен без as/!/any
export function total(payments: Payment[]): number {
  return payments.reduce((sum, payment) => {
    return payment.kind === "cash" ? sum + payment.amount : sum;
  }, 0);
}
