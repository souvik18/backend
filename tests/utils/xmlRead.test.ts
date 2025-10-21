import fs from "fs";
import { XMLParser } from "fast-xml-parser";
import { xmlRead } from "../../src/utils/xmlRead";
 
jest.mock("fs");
jest.mock("fast-xml-parser");
 
describe("xmlRead", () => {
  const mockReadFileSync = fs.readFileSync as jest.Mock;
  let MockedXMLParser: jest.MockedClass<typeof XMLParser>;
  const mockParse = jest.fn();
 
  beforeEach(() => {
    jest.clearAllMocks();
    MockedXMLParser = XMLParser as unknown as jest.MockedClass<typeof XMLParser>;
    MockedXMLParser.mockImplementation(() => ({
      parse: mockParse,
    }) as any);
  });
 
  test("should parse XML and return converted records (array case)", async () => {
    mockReadFileSync.mockReturnValue("<xml></xml>");
    mockParse.mockReturnValue({
      records: {
        record: [
          { reference: "123", name: "John" },
          { reference: "456", name: "Jane" },
        ],
      },
    });
 
    const result = await xmlRead("dummy.xml");
 
    expect(mockReadFileSync).toHaveBeenCalledWith("dummy.xml", "utf-8");
    expect(MockedXMLParser).toHaveBeenCalledWith({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      trimValues: true,
      parseTagValue: false,
    });
    expect(result).toEqual([
      { reference: 123, name: "John" },
      { reference: 456, name: "Jane" },
    ]);
  });
 
  test("should wrap single record in array", async () => {
    mockReadFileSync.mockReturnValue("<xml></xml>");
    mockParse.mockReturnValue({
      records: {
        record: { reference: "789", name: "Single" },
      },
    });
 
    const result = await xmlRead("dummy.xml");
    expect(result).toEqual([{ reference: 789, name: "Single" }]);
  });
});