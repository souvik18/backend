import { validateRecords } from "../../src/validation/validator";
import { MESSAGES } from "../../src/constant";
import { recordSchema } from "../../src/schemas/recordSchema";
 
jest.mock("../../src/schemas/recordSchema", () => {
  const actual = jest.requireActual("../../src/schemas/recordSchema");
  return {
    ...actual,
    recordSchema: {
      safeParse: jest.fn(),
    },
    formatZodIssues: jest.fn().mockReturnValue("Invalid data"),
  };
});
 
describe("validateRecords", () => {
  const mockSafeParse = recordSchema.safeParse as jest.Mock;
 
  beforeEach(() => {
    jest.clearAllMocks();
  });
 
  test("should return valid record when schema pass and end balance matches", () => {
    const record = {
      reference: 1,
      accountNumber: "NL91ABNA0417164300",
      description: "Valid",
      startBalance: 100,
      mutation: 20,
      endBalance: 120,
    };
 
    mockSafeParse.mockReturnValue({ success: true, data: record });
 
    const result = validateRecords([record]);
 
    expect(result.valid).toHaveLength(1);
    expect(result.failed).toHaveLength(0);
    expect(result.correctData).toEqual([
      { reference: 1, description: "Valid" },
    ]);
  });
 
  test("should add to fail when schema validation fail", () => {
    const record = {
      reference: 2,
      accountNumber: "NL91ABNA0417164301",
      description: "Invalid",
      startBalance: 0,
      mutation: 0,
      endBalance: 0,
    };
 
    mockSafeParse.mockReturnValue({ success: false, error: { issues: [] } });
 
    const result = validateRecords([record]);
 
    expect(result.valid).toHaveLength(0);
    expect(result.failed).toEqual([
      expect.objectContaining({
        reference: 2,
        reason: "Invalid data",
      }),
    ]);
  });
 
  test("should catch duplicate reference", () => {
    const record = {
      reference: 3,
      accountNumber: "NL91ABNA0417164302",
      description: "Duplicate",
      startBalance: 50,
      mutation: 10,
      endBalance: 60,
    };
 
    mockSafeParse.mockReturnValue({ success: true, data: record });
 
    const result = validateRecords([record, record]);
 
    expect(result.failed).toEqual([
      expect.objectContaining({
        reference: 3,
        reason: MESSAGES.duplicateTransaction,
      }),
    ]);
  });
 
  test("should detect incorrect end balance", () => {
    const record = {
      reference: 4,
      accountNumber: "NL91ABNA0417164303",
      description: "Wrong balance",
      startBalance: 100,
      mutation: 10,
      endBalance: 200, // incorrect
    };
 
    mockSafeParse.mockReturnValue({ success: true, data: record });
 
    const result = validateRecords([record]);
 
    expect(result.failed).toEqual([
      expect.objectContaining({
        reference: 4,
        reason: MESSAGES.incorrectEndBalance,
      }),
    ]);
  });
 
  test("should handle multiple mixed records", () => {
    const validRecord = {
      reference: 5,
      accountNumber: "NL91ABNA0417164304",
      description: "Valid",
      startBalance: 10,
      mutation: 5,
      endBalance: 15,
    };
    const invalidRecord = {
      reference: 6,
      accountNumber: "NL91ABNA0417164305",
      description: "Invalid",
      startBalance: 0,
      mutation: 0,
      endBalance: 0,
    };
 
    mockSafeParse
      .mockReturnValueOnce({ success: true, data: validRecord })
      .mockReturnValueOnce({ success: false, error: { issues: [] } });
 
    const result = validateRecords([validRecord, invalidRecord]);
 
    expect(result.valid).toHaveLength(1);
    expect(result.failed).toHaveLength(1);
    expect(result.correctData).toHaveLength(1);
  });
 
  test("should return empty arrays when input is empty", () => {
    const result = validateRecords([]);
    expect(result.valid).toEqual([]);
    expect(result.failed).toEqual([]);
    expect(result.correctData).toEqual([]);
  });
});