# RentSecure E2E Flows (Maestro)

This directory contains Maestro E2E flows for the RentSecure application.

## Prerequisites

1. Install Maestro: https://maestro.mobile.dev/getting-started/install
2. Build and install the app on a device/emulator
3. Ensure the backend is running at `http://localhost:8000` (or set `BASE_URL` env)

## Running Flows

```bash
# Run a single flow
maestro test .maestro/flows/auth/login_owner.yaml

# Run all flows in a directory
maestro test .maestro/flows/auth/

# Run all flows
maestro test .maestro/flows/
```

## Environment Variables

Set these before running flows:

- `BASE_URL`: Backend URL (default: `http://localhost:8000`)
- `E2E_OWNER_PHONE`: Test owner phone number
- `E2E_OWNER_OTP`: Test owner OTP (DEBUG mode accepts any OTP)
- `E2E_RENTER_PHONE`: Test renter phone number
- `E2E_RENTER_OTP`: Test renter OTP

## Flow Organization

```
.maestro/flows/
  auth/          - Login, logout, OTP flows
  owner/         - Building, unit, renter, caretaker management
  renter/        - Renter dashboard, pay rent
  rent/          - Rent record lifecycle
  payment/       - Payment flows
  agreement/     - Agreement flows
  maintenance/   - Maintenance request flows
  notifications/ - Notification center
  ai/            - AI assistant chat
  profile/       - Profile management
  subscription/  - Subscription flows
  security/      - IDOR and authorization tests
```

## Notes

- These flows require the app to be built with `EXPO_PUBLIC_BASE_URL` set to the test backend.
- Do NOT use production credentials in these flows.
- Flows are designed for a clean app state (no cached sessions).
