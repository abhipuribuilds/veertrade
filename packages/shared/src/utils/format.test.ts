import { describe, it, expect } from "vitest";
import { formatCurrency, formatPercentage } from "./format";

describe("formatCurrency", () => {
  it("formats INR correctly", () => {
    expect(formatCurrency(1500)).toContain("1,500");
  });
});

describe("formatPercentage", () => {
  it("adds plus sign for positive", () => {
    expect(formatPercentage(5.5)).toBe("+5.50%");
  });

  it("adds minus sign for negative", () => {
    expect(formatPercentage(-3.2)).toBe("-3.20%");
  });
});
