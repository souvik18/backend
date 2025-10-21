import * as Zod from 'zod';
import { isValidIBAN } from 'ibantools';
import { MESSAGES } from '../constant.ts';

export const recordSchema = Zod.object({
  reference: Zod.coerce
    .number()
    .positive({ message: MESSAGES.zodReferenceErrMsg }),

  accountNumber: Zod.string().refine((val) => isValidIBAN(val), {
    message: MESSAGES.invalidIban,
  }),

  description: Zod.string({ message: MESSAGES.zodDescriptionErrMsg }),

  startBalance: Zod.coerce.number({ message: MESSAGES.zodStartBalanceErrMsg }),

  mutation: Zod.string({ message: MESSAGES.zodMutationRequired })
    .refine((val) => /^[-+]\d+(\.\d+)?$/.test(val), {
      message: MESSAGES.zodMutationErrMsg,
    })
    .transform((val) => parseFloat(val)),

  endBalance: Zod.coerce.number({ message: MESSAGES.zodEndBalanceErrMsg }),
});

export type RecordType = Zod.infer<typeof recordSchema>;

export function formatZodIssues(
  issues: { path: PropertyKey[]; message: string }[],
): string {
  return issues
    .map((issue) => {
      const path = issue.path
        .filter((p) => typeof p === 'string' || typeof p === 'number')
        .join('.');
      return `${path} -  ${issue.message}`;
    })
    .join('; ');
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
