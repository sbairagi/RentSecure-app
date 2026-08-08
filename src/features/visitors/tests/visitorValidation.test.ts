import {
  visitorApprovalSchema,
  otpVerifySchema,
  visitorFilterSchema,
  validateVisitor,
  visitorPurposeValues,
  visitorStatusValues,
} from "../validations/visitorValidation";

describe("visitorSchema", () => {
  const validVisitor = {
    visitor_name: "John Doe",
    phone_number: "+919999999999",
    email: "john@example.com",
    purpose: "personal_visit" as const,
    building: 1,
    unit: 1,
    renter: 1,
    visit_date: "2026-08-10",
    expected_arrival: "2026-08-10T10:00:00Z",
    expected_departure: "2026-08-10T12:00:00Z",
    number_of_visitors: 2,
    vehicle_number: "ABC-1234",
    notes: "Some notes",
  };

  it("should validate a valid visitor", () => {
    const result = validateVisitor(validVisitor);
    expect(result.success).toBe(true);
  });

  it("should reject visitor with empty name", () => {
    const result = validateVisitor({ ...validVisitor, visitor_name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("visitor_name"))).toBe(true);
    }
  });

  it("should reject visitor with name > 100 chars", () => {
    const result = validateVisitor({ ...validVisitor, visitor_name: "a".repeat(101) });
    expect(result.success).toBe(false);
  });

  it("should reject invalid phone number", () => {
    const result = validateVisitor({ ...validVisitor, phone_number: "abc" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid email", () => {
    const result = validateVisitor({ ...validVisitor, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid purpose", () => {
    const result = validateVisitor({ ...validVisitor, purpose: "invalid_purpose" });
    expect(result.success).toBe(false);
  });

  it("should allow empty email", () => {
    const result = validateVisitor({ ...validVisitor, email: "" });
    expect(result.success).toBe(true);
  });

  it("should require building", () => {
    const result = validateVisitor({ ...validVisitor, building: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("building"))).toBe(true);
    }
  });

  it("should require unit", () => {
    const result = validateVisitor({ ...validVisitor, unit: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("unit"))).toBe(true);
    }
  });

  it("should require renter", () => {
    const result = validateVisitor({ ...validVisitor, renter: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("renter"))).toBe(true);
    }
  });

  it("should require visit_date", () => {
    const result = validateVisitor({ ...validVisitor, visit_date: "" });
    expect(result.success).toBe(false);
  });

  it("should reject departure before arrival (if enforced by schema)", () => {
    const result = validateVisitor({
      ...validVisitor,
      expected_arrival: "2026-08-10T12:00:00Z",
      expected_departure: "2026-08-10T10:00:00Z",
    });
    expect(result.success).toBe(false);
  });
});

describe("visitorApprovalSchema", () => {
  it("should validate approve action", () => {
    const result = visitorApprovalSchema.safeParse({ action: "approve", notes: "Welcome" });
    expect(result.success).toBe(true);
  });

  it("should validate reject action", () => {
    const result = visitorApprovalSchema.safeParse({
      action: "reject",
      reason: "Not available",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid action", () => {
    const result = visitorApprovalSchema.safeParse({ action: "invalid" });
    expect(result.success).toBe(false);
  });

  it("should allow empty reason/notes", () => {
    const result = visitorApprovalSchema.safeParse({ action: "approve" });
    expect(result.success).toBe(true);
  });
});

describe("otpVerifySchema", () => {
  it("should validate 6-digit OTP", () => {
    const result = otpVerifySchema.safeParse({ otp_code: "123456" });
    expect(result.success).toBe(true);
  });

  it("should reject OTP with fewer than 6 digits", () => {
    const result = otpVerifySchema.safeParse({ otp_code: "12345" });
    expect(result.success).toBe(false);
  });

  it("should reject OTP with non-digit characters", () => {
    const result = otpVerifySchema.safeParse({ otp_code: "abc123" });
    expect(result.success).toBe(false);
  });
});

describe("visitorFilterSchema", () => {
  it("should validate empty filters", () => {
    const result = visitorFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should validate with status", () => {
    const result = visitorFilterSchema.safeParse({ status: "approved" });
    expect(result.success).toBe(true);
  });

  it("should validate with search", () => {
    const result = visitorFilterSchema.safeParse({ search: "John" });
    expect(result.success).toBe(true);
  });

  it("should reject invalid status", () => {
    const result = visitorFilterSchema.safeParse({ status: "invalid_status" });
    expect(result.success).toBe(false);
  });
});

describe("visitorPurposeValues", () => {
  it("should contain all purpose values", () => {
    expect(visitorPurposeValues).toContain("personal_visit");
    expect(visitorPurposeValues).toContain("family_visit");
    expect(visitorPurposeValues).toContain("business_meeting");
    expect(visitorPurposeValues).toContain("service_personnel");
    expect(visitorPurposeValues).toContain("maintenance");
    expect(visitorPurposeValues).toContain("delivery");
    expect(visitorPurposeValues).toContain("emergency");
    expect(visitorPurposeValues).toContain("other");
  });
});

describe("visitorStatusValues", () => {
  it("should contain all status values", () => {
    expect(visitorStatusValues).toContain("requested");
    expect(visitorStatusValues).toContain("pending_approval");
    expect(visitorStatusValues).toContain("approved");
    expect(visitorStatusValues).toContain("rejected");
    expect(visitorStatusValues).toContain("checked_in");
    expect(visitorStatusValues).toContain("checked_out");
    expect(visitorStatusValues).toContain("expired");
    expect(visitorStatusValues).toContain("cancelled");
    expect(visitorStatusValues).toContain("blocked");
  });
});
