import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useRouter } from "./use-router";

describe("useRouter clean paths", () => {
  it("treats /about as the about route when no hash is present", () => {
    window.history.pushState(null, "", "/about");
    window.location.hash = "";

    const { result } = renderHook(() => useRouter());

    expect(result.current.route).toBe("about");
  });

  it("treats /tutorial as the tutorial route when no hash is present", () => {
    window.history.pushState(null, "", "/tutorial");
    window.location.hash = "";

    const { result } = renderHook(() => useRouter());

    expect(result.current.route).toBe("tutorial");
  });
});
