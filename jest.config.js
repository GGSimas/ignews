module.exports = {
  testPathIgnorePatterns: ["/node_modules", "/.next"],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  moduleNameMapper: {
    "\\.(scss|css|sass)$": "identity-obj-proxy",
  },
  collectCovarage: true,
  collectCovarageFrom: [
    "src/**/*.{tsx}",
    "!src/**/*.spec.tsx",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  covaregeReporters: ["lcov", "json"]
};