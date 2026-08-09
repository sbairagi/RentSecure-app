import { redactObject, redactHeaders, sanitizeForLogging } from '@/core/observability/utils/redact';

describe('Sensitive data redaction - passwords', () => {
  it('should redact password field', () => {
    const result = redactObject({ password: 'mypassword' });
    expect(result.password).toBe('[REDACTED]');
  });

  it('should redact confirmPassword field', () => {
    const result = redactObject({ confirmPassword: 'mypassword' });
    expect(result.confirmPassword).toBe('[REDACTED]');
  });
});

describe('Sensitive data redaction - JWT tokens', () => {
  it('should redact access_token', () => {
    const result = redactObject({ access_token: 'eyJhbGciOi...' });
    expect(result.access_token).toBe('[REDACTED]');
  });

  it('should redact refresh_token', () => {
    const result = redactObject({ refresh_token: 'eyJhbGciOi...' });
    expect(result.refresh_token).toBe('[REDACTED]');
  });

  it('should redact Authorization header', () => {
    const result = redactHeaders({ Authorization: 'Bearer eyJhbGciOi...' });
    expect(result.Authorization).toBe('[REDACTED]');
  });
});

describe('Sensitive data redaction - OTP', () => {
  it('should redact otp field', () => {
    const result = redactObject({ otp: '123456' });
    expect(result.otp).toBe('[REDACTED]');
  });
});

describe('Sensitive data redaction - payment credentials', () => {
  it('should redact card_number', () => {
    const result = redactObject({ card_number: '4111111111111111' });
    expect(result.card_number).toBe('[REDACTED]');
  });

  it('should redact cvv', () => {
    const result = redactObject({ cvv: '123' });
    expect(result.cvv).toBe('[REDACTED]');
  });

  it('should redact cvv2', () => {
    const result = redactObject({ cvv2: '123' });
    expect(result.cvv2).toBe('[REDACTED]');
  });

  it('should redact Razorpay secret', () => {
    const result = redactObject({ razorpay_secret: 'secret123' });
    expect(result.razorpay_secret).toBe('[REDACTED]');
  });

  it('should redact Cashfree secret', () => {
    const result = redactObject({ cashfree_secret: 'secret123' });
    expect(result.cashfree_secret).toBe('[REDACTED]');
  });

  it('should redact bank account number', () => {
    const result = redactObject({ bank_account: '1234567890' });
    expect(result.bank_account).toBe('[REDACTED]');
  });
});

describe('Sensitive data redaction - API keys', () => {
  it('should redact api_key', () => {
    const result = redactObject({ api_key: 'key123' });
    expect(result.api_key).toBe('[REDACTED]');
  });

  it('should redact Twilio auth token', () => {
    const result = redactObject({ twilio_auth_token: 'token123' });
    expect(result.twilio_auth_token).toBe('[REDACTED]');
  });

  it('should redact FCM server key', () => {
    const result = redactObject({ fcm_server_key: 'key123' });
    expect(result.fcm_server_key).toBe('[REDACTED]');
  });

  it('should redact OpenAI API key', () => {
    const result = redactObject({ openai_api_key: 'sk-...' });
    expect(result.openai_api_key).toBe('[REDACTED]');
  });
});

describe('Sensitive data redaction - documents', () => {
  it('should redact document field', () => {
    const result = redactObject({ document: 'base64encoded...' });
    expect(result.document).toBe('[REDACTED]');
  });

  it('should redact file field with base64 content', () => {
    const result = redactObject({ file: { data: 'base64...', type: 'application/pdf' } });
    expect(result.file.data).toBe('[REDACTED]');
  });
});

describe('Sensitive data redaction - nested objects', () => {
  it('should redact in deeply nested objects', () => {
    const data = {
      level1: {
        level2: {
          level3: {
            password: 'secret',
            name: 'safe',
          },
        },
      },
    };
    const result = redactObject(data);
    expect((result as any).level1.level2.level3.password).toBe('[REDACTED]');
    expect((result as any).level1.level2.level3.name).toBe('safe');
  });
});

describe('Sensitive data redaction - sanitizeForLogging', () => {
  it('should redact in API request bodies', () => {
    const requestBody = {
      email: 'test@example.com',
      password: 'secret',
      phone: '+1234567890',
    };
    const result = sanitizeForLogging(requestBody);
    expect(result.password).toBe('[REDACTED]');
    expect(result.email).toBe('test@example.com');
    expect(result.phone).toBe('+1234567890');
  });

  it('should preserve non-sensitive data', () => {
    const data = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
    };
    const result = sanitizeForLogging(data);
    expect(result.name).toBe('John Doe');
    expect(result.age).toBe(30);
    expect(result.email).toBe('john@example.com');
  });
});
