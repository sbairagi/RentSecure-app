declare namespace jest {
  type Mock = any;
}

declare const jest: {
  fn: (...args: any[]) => any;
  mock: (moduleName: string, factory?: any) => void;
  clearAllMocks: () => void;
  spyOn: (
    obj: any,
    method: string
  ) => {
    mockResolvedValue: (val: any) => any;
    mockRejectedValue: (err: any) => any;
    toHaveBeenCalledWith: (args: any) => any;
    toHaveBeenCalled: () => any;
  };
  Mock: any;
};

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function expect(actual: any): any;
declare function beforeEach(fn: () => void): void;
declare function afterEach(fn: () => void): void;
declare function beforeAll(fn: () => void): void;
declare function afterAll(fn: () => void): void;
