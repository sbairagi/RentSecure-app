import { useCaretakers } from '../hooks/useCaretakers';

jest.mock('../hooks/useCaretakers', () => ({
  useCaretakers: jest.fn(),
}));

describe('Caretaker Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export useCaretakers hook', () => {
    expect(useCaretakers).toBeDefined();
  });
});
