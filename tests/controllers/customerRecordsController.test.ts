import { customerRecordsController } from "../../src/controllers/customerRecordsController.ts";
import { MESSAGES } from "../../src/constant.ts";
import { csvRead } from "../../src/utils/csvRead.ts";
import { xmlRead } from "../../src/utils/xmlRead.ts";
import { validateRecords } from "../../src/validation/validator.ts";
 
jest.mock("../../src/utils/csvRead.ts");
jest.mock("../../src/utils/xmlRead.ts");
jest.mock("../../src/validation/validator.ts");
 
describe("customerRecordsController", () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
 
  beforeEach(() => {
    jest.clearAllMocks();
  });
 
  test("should return 400 if no file uploaded", async () => {
    const req: any = { file: null };
    const res = mockRes();
 
    await customerRecordsController(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: MESSAGES.noFileUploaded,
    });
  });
 
  test("should process CSV file successfully", async () => {
    (csvRead as jest.Mock).mockResolvedValue([{ id: 1, name: "John" }]);
    (validateRecords as jest.Mock).mockReturnValue({
      valid: [{ id: 1, name: "John" }],
      failed: [],
      correctData: [{ id: 1, name: "John" }],
    });
 
    const req: any = { file: { originalname: "test.csv", path: "dummy.csv" } };
    const res = mockRes();
 
    await customerRecordsController(req, res);
 
    expect(csvRead).toHaveBeenCalledWith("dummy.csv");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        totalRecords: 1,
        validCount: 1,
        failedCount: 0,
      })
    );
  });
 
  test("should process XML file successfully", async () => {
    (xmlRead as jest.Mock).mockResolvedValue([{ id: 2, name: "Jane" }]);
    (validateRecords as jest.Mock).mockReturnValue({
      valid: [{ id: 2, name: "Jane" }],
      failed: [],
      correctData: [{ id: 2, name: "Jane" }],
    });
 
    const req: any = { file: { originalname: "test.xml", path: "dummy.xml" } };
    const res = mockRes();
 
    await customerRecordsController(req, res);
 
    expect(xmlRead).toHaveBeenCalledWith("dummy.xml");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        totalRecords: 1,
      })
    );
  });
 
  test("should return 400 for unsupported file type", async () => {
    const req: any = { file: { originalname: "test.txt", path: "dummy.txt" } };
    const res = mockRes();
 
    await customerRecordsController(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: MESSAGES.unsupportedFile,
    });
  });
 
  test("should handle internal server error", async () => {
    (csvRead as jest.Mock).mockRejectedValue(new Error("Read error"));
 
    const req: any = { file: { originalname: "test.csv", path: "dummy.csv" } };
    const res = mockRes();
 
    await customerRecordsController(req, res);
 
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: MESSAGES.internalError,
        details: expect.stringContaining("Read error"),
      })
    );
  });
});