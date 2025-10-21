import fs from "fs";
import { csvRead } from "../../src/utils/csvRead.ts";
import { parse } from "csv-parse";
 
jest.mock("fs");
jest.mock("csv-parse", () => ({
  parse: jest.fn(),
}));
 
describe("csvRead", () => {
  const mockCreateReadStream = fs.createReadStream as jest.Mock;
  const mockParse = parse as jest.Mock;
 
  beforeEach(() => {
    jest.clearAllMocks();
  });
 
  test("should resolve with parsed records", async () => {
    const mockOn = jest.fn();
    const mockPipe = jest.fn().mockReturnValue({
      on: mockOn,
    });
 
    // Simulate fs.createReadStream returning an object with pipe()
    mockCreateReadStream.mockReturnValue({ pipe: mockPipe });
 
    // Simulate parse returning a dummy parser
    mockParse.mockReturnValue("parser");
 
    // Simulate event listeners
    mockOn.mockImplementation((event, callback) => {
      if (event === "data") {
        callback({
          Reference: "123",
          "Account Number": "NL91ABNA0417164300",
          Description: "Test",
          "Start Balance": "100.0",
          Mutation: "20.0",
          "End Balance": "120.0",
        });
      }
      if (event === "end") {
        callback();
      }
      return { on: mockOn };
    });
 
    const result = await csvRead("dummy.csv");
 
    expect(mockCreateReadStream).toHaveBeenCalledWith("dummy.csv");
    expect(mockPipe).toHaveBeenCalledWith("parser");
    expect(mockParse).toHaveBeenCalledWith({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      encoding: "utf-8",
    });
 
    expect(result).toEqual([
      {
        reference: 123,
        accountNumber: "NL91ABNA0417164300",
        description: "Test",
        startBalance: 100,
        mutation: "+20.0",
        endBalance: 120,
      },
    ]);
  });
 
  test("should reject on error event", async () => {
    const mockOn = jest.fn();
    const mockPipe = jest.fn().mockReturnValue({
      on: mockOn,
    });
 
    mockCreateReadStream.mockReturnValue({ pipe: mockPipe });
    mockParse.mockReturnValue("parser");
 
    mockOn.mockImplementation((event, callback) => {
      if (event === "error") {
        callback(new Error("Stream error"));
      }
      return { on: mockOn };
    });
 
    await expect(csvRead("dummy.csv")).rejects.toThrow("Stream error");
  });
});