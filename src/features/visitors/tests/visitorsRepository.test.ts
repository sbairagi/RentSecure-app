import { visitorsRepository } from "../repository/visitorsRepository";

jest.mock("../services/visitorsApi", () => ({
  visitorsApi: {
    list: jest.fn(),
    retrieve: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    approve: jest.fn(),
    reject: jest.fn(),
    cancel: jest.fn(),
    block: jest.fn(),
    checkIn: jest.fn(),
    checkOut: jest.fn(),
    generateQR: jest.fn(),
    verifyQR: jest.fn(),
    generateOTP: jest.fn(),
    verifyOTP: jest.fn(),
    getHistory: jest.fn(),
    getStats: jest.fn(),
    getBuildings: jest.fn(),
    getUnits: jest.fn(),
    getRenters: jest.fn(),
    getNotifications: jest.fn(),
    verifyQRPublic: jest.fn(),
    markExpired: jest.fn(),
  },
}));

const mockVisitorsApi = require("../services/visitorsApi").visitorsApi;

describe("visitorsRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch visitors via list", async () => {
    const mockResponse = { results: [], count: 0 };
    mockVisitorsApi.list.mockResolvedValue(mockResponse);

    const result = await visitorsRepository.fetchVisitors({ search: "test" });

    expect(mockVisitorsApi.list).toHaveBeenCalledWith({ search: "test" });
    expect(result).toEqual(mockResponse);
  });

  it("should fetch a single visitor", async () => {
    const mockVisitor = { id: 1, visitor_name: "John Doe" };
    mockVisitorsApi.retrieve.mockResolvedValue(mockVisitor);

    const result = await visitorsRepository.fetchVisitor(1);

    expect(mockVisitorsApi.retrieve).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockVisitor);
  });

  it("should create a visitor", async () => {
    const mockVisitor = { id: 1, visitor_name: "John Doe" };
    mockVisitorsApi.create.mockResolvedValue(mockVisitor);

    const result = await visitorsRepository.createVisitor({
      visitor_name: "John Doe",
      phone_number: "+919999999999",
      building: 1,
      unit: 1,
      renter: 1,
      visit_date: "2026-08-10",
      expected_arrival: "2026-08-10T10:00:00Z",
      expected_departure: "2026-08-10T12:00:00Z",
      purpose: "personal_visit",
    });

    expect(mockVisitorsApi.create).toHaveBeenCalled();
    expect(result).toEqual(mockVisitor);
  });

  it("should approve a visitor", async () => {
    mockVisitorsApi.approve.mockResolvedValue({ id: 1, status: "approved" });

    const result = await visitorsRepository.approveVisitor(1, "Welcome");

    expect(mockVisitorsApi.approve).toHaveBeenCalledWith(1, "Welcome");
    expect(result.status).toBe("approved");
  });

  it("should check in a visitor", async () => {
    mockVisitorsApi.checkIn.mockResolvedValue({ message: "Checked in" });

    const result = await visitorsRepository.checkInVisitor(1, { vehicle_details: "ABC" });

    expect(mockVisitorsApi.checkIn).toHaveBeenCalledWith(1, { vehicle_details: "ABC" });
    expect(result.message).toBe("Checked in");
  });

  it("should check out a visitor", async () => {
    mockVisitorsApi.checkOut.mockResolvedValue({
      message: "Checked out",
      visit_duration_minutes: 120,
    });

    const result = await visitorsRepository.checkOutVisitor(1);

    expect(mockVisitorsApi.checkOut).toHaveBeenCalledWith(1);
    expect(result.visit_duration_minutes).toBe(120);
  });

  it("should generate QR code", async () => {
    const mockQR = {
      message: "QR generated",
      qr_token: "abc123",
      qr_generated_at: "2026-08-08T00:00:00Z",
      qr_expires_at: "2026-08-09T00:00:00Z",
      qr_max_uses: 2,
    };
    mockVisitorsApi.generateQR.mockResolvedValue(mockQR);

    const result = await visitorsRepository.generateQR(1);

    expect(mockVisitorsApi.generateQR).toHaveBeenCalledWith(1);
    expect(result.qr_token).toBe("abc123");
  });

  it("should generate OTP", async () => {
    mockVisitorsApi.generateOTP.mockResolvedValue({
      message: "OTP generated",
      otp_expires_at: "2026-08-08T00:05:00Z",
      otp_attempts_remaining: 5,
    });

    const result = await visitorsRepository.generateOTP(1);

    expect(mockVisitorsApi.generateOTP).toHaveBeenCalledWith(1);
    expect(result.otp_attempts_remaining).toBe(5);
  });

  it("should verify OTP", async () => {
    mockVisitorsApi.verifyOTP.mockResolvedValue({ message: "OTP verified" });

    const result = await visitorsRepository.verifyOTP(1, "123456");

    expect(mockVisitorsApi.verifyOTP).toHaveBeenCalledWith(1, "123456");
    expect(result.message).toBe("OTP verified");
  });

  it("should fetch stats", async () => {
    const mockStats = { total: 10, pending_approval: 2 };
    mockVisitorsApi.getStats.mockResolvedValue(mockStats);

    const result = await visitorsRepository.fetchStats();

    expect(mockVisitorsApi.getStats).toHaveBeenCalled();
    expect(result.total).toBe(10);
  });

  it("should mark visitor as expired", async () => {
    mockVisitorsApi.markExpired.mockResolvedValue({ message: "2 visitors marked as expired" });

    const result = await visitorsRepository.markExpired();

    expect(mockVisitorsApi.markExpired).toHaveBeenCalled();
    expect(result.message).toContain("2");
  });
});
