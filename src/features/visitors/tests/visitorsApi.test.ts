import { visitorsApi } from "../services/visitorsApi";

jest.mock("@/services/api/apiClient", () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    upload: jest.fn(),
  },
}));

const mockApiService = require("@/services/api/apiClient").apiService;

describe("visitorsApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should fetch visitors with no params", async () => {
      const mockResponse = { results: [], count: 0 };
      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await visitorsApi.list();

      expect(mockApiService.get).toHaveBeenCalledWith("/api/visitors/");
      expect(result).toEqual(mockResponse);
    });

    it("should fetch visitors with params", async () => {
      const mockResponse = { results: [], count: 0 };
      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await visitorsApi.list({
        search: "John",
        status: "approved",
        page: 1,
      });

      expect(mockApiService.get).toHaveBeenCalledWith(
        "/api/visitors/?search=John&status=approved&page=1"
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("retrieve", () => {
    it("should fetch a single visitor", async () => {
      const mockVisitor = { id: 1, visitor_name: "John Doe", status: "approved" };
      mockApiService.get.mockResolvedValue(mockVisitor);

      const result = await visitorsApi.retrieve(1);

      expect(mockApiService.get).toHaveBeenCalledWith("/api/visitors/1/");
      expect(result).toEqual(mockVisitor);
    });
  });

  describe("create", () => {
    it("should create a visitor", async () => {
      const mockVisitor = { id: 1, visitor_name: "John Doe" };
      mockApiService.post.mockResolvedValue(mockVisitor);

      const payload = {
        visitor_name: "John Doe",
        phone_number: "+919999999999",
        purpose: "personal_visit" as const,
        building: 1,
        unit: 1,
        renter: 1,
        visit_date: "2026-08-10",
        expected_arrival: "2026-08-10T10:00:00Z",
        expected_departure: "2026-08-10T12:00:00Z",
      };

      const result = await visitorsApi.create(payload);

      expect(mockApiService.post).toHaveBeenCalledWith("/api/visitors/", payload);
      expect(result).toEqual(mockVisitor);
    });
  });

  describe("approve", () => {
    it("should approve a visitor", async () => {
      const mockVisitor = { id: 1, status: "approved" };
      mockApiService.post.mockResolvedValue(mockVisitor);

      const result = await visitorsApi.approve(1, { notes: "Welcome!" });

      expect(mockApiService.post).toHaveBeenCalledWith("/api/visitors/1/approve/", {
        action: "approve",
        notes: "Welcome!",
      });
      expect(result).toEqual(mockVisitor);
    });
  });

  describe("reject", () => {
    it("should reject a visitor", async () => {
      const mockVisitor = { id: 1, status: "rejected" };
      mockApiService.post.mockResolvedValue(mockVisitor);

      const result = await visitorsApi.reject(1, { reason: "Not available" });

      expect(mockApiService.post).toHaveBeenCalledWith("/api/visitors/1/reject/", {
        action: "reject",
        reason: "Not available",
      });
      expect(result).toEqual(mockVisitor);
    });
  });

  describe("checkIn", () => {
    it("should check in a visitor", async () => {
      mockApiService.post.mockResolvedValue({ message: "Checked in" });

      const result = await visitorsApi.checkIn(1, { vehicle_details: "ABC-1234" });

      expect(mockApiService.post).toHaveBeenCalledWith("/api/visitors/1/check-in/", {
        vehicle_details: "ABC-1234",
      });
      expect(result).toEqual({ message: "Checked in" });
    });
  });

  describe("checkOut", () => {
    it("should check out a visitor", async () => {
      mockApiService.post.mockResolvedValue({
        message: "Checked out",
        visit_duration_minutes: 120,
      });

      const result = await visitorsApi.checkOut(1);

      expect(mockApiService.post).toHaveBeenCalledWith("/api/visitors/1/check-out/", {});
      expect(result).toEqual({ message: "Checked out", visit_duration_minutes: 120 });
    });
  });

  describe("generateQR", () => {
    it("should generate QR code", async () => {
      const mockResponse = {
        message: "QR generated",
        qr_token: "abc123",
        qr_generated_at: "2026-08-08T00:00:00Z",
        qr_expires_at: "2026-08-09T00:00:00Z",
        qr_max_uses: 2,
      };
      mockApiService.post.mockResolvedValue(mockResponse);

      const result = await visitorsApi.generateQR(1);

      expect(mockApiService.post).toHaveBeenCalledWith("/api/visitors/1/generate-qr/", {});
      expect(result).toEqual(mockResponse);
    });
  });

  describe("generateOTP", () => {
    it("should generate OTP", async () => {
      const mockResponse = {
        message: "OTP generated",
        otp_expires_at: "2026-08-08T00:05:00Z",
        otp_attempts_remaining: 5,
      };
      mockApiService.post.mockResolvedValue(mockResponse);

      const result = await visitorsApi.generateOTP(1);

      expect(mockApiService.post).toHaveBeenCalledWith("/api/visitors/1/generate-otp/", {});
      expect(result).toEqual(mockResponse);
    });
  });

  describe("verifyOTP", () => {
    it("should verify OTP", async () => {
      mockApiService.post.mockResolvedValue({ message: "OTP verified" });

      const result = await visitorsApi.verifyOTP(1, "123456");

      expect(mockApiService.post).toHaveBeenCalledWith("/api/visitors/1/verify-otp/", {
        otp_code: "123456",
      });
      expect(result).toEqual({ message: "OTP verified" });
    });
  });

  describe("verifyQRPublic", () => {
    it("should verify QR publicly", async () => {
      const mockResponse = { message: "QR is valid", visitor: { id: 1 } };
      mockApiService.post.mockResolvedValue(mockResponse);

      const result = await visitorsApi.verifyQRPublic("token123");

      expect(mockApiService.post).toHaveBeenCalledWith(
        "/api/visitors/verify/verify-qr/",
        { qr_token: "token123" }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getStats", () => {
    it("should fetch visitor stats", async () => {
      const mockStats = {
        total: 10,
        pending_approval: 2,
        approved: 3,
        checked_in: 1,
        checked_out: 4,
        rejected: 0,
        expired: 0,
        cancelled: 0,
        blocked: 0,
        today: 2,
        this_week: 5,
      };
      mockApiService.get.mockResolvedValue(mockStats);

      const result = await visitorsApi.getStats();

      expect(mockApiService.get).toHaveBeenCalledWith("/api/visitors/stats/");
      expect(result).toEqual(mockStats);
    });
  });

  describe("getHistory", () => {
    it("should fetch visitor history", async () => {
      const mockHistory = [{ id: 1, action: "created", description: "Created" }];
      mockApiService.get.mockResolvedValue(mockHistory);

      const result = await visitorsApi.getHistory(1);

      expect(mockApiService.get).toHaveBeenCalledWith("/api/visitors/1/history/");
      expect(result).toEqual(mockHistory);
    });
  });
});
