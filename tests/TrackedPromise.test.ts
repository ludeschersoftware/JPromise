import TrackedPromise from "../src/TrackedPromise";
import PromiseStatus from "../src/PromiseStatus";

describe("TrackedPromise", () => {
    it("should start with status Pending", () => {
        const tracked = new TrackedPromise(Promise.resolve("ok"));
        expect(tracked.Status).toBe(PromiseStatus.Pending);
        expect(tracked.Result).toBeUndefined();
        expect(tracked.Error).toBeUndefined();
        expect(tracked.Promise).toBeInstanceOf(Promise);
    });

    it("should transition to Fulfilled when resolved", async () => {
        const tracked = new TrackedPromise(Promise.resolve("data"));
        const result = await tracked.Promise;

        expect(result).toBe("data");
        expect(tracked.Status).toBe(PromiseStatus.Fulfilled);
        expect(tracked.Result).toBe("data");
        expect(tracked.Error).toBeUndefined();
    });

    it("should transition to Rejected when rejected", async () => {
        const tracked = new TrackedPromise(Promise.reject(new Error("fail")));

        await expect(tracked.Promise).rejects.toThrow("fail");

        expect(tracked.Status).toBe(PromiseStatus.Rejected);
        expect(tracked.Result).toBeUndefined();
        expect(tracked.Error).toBeInstanceOf(Error);
        expect(tracked.Error.message).toBe("fail");
    });

    it("should preserve error type (non-Error rejects)", async () => {
        const tracked = new TrackedPromise(Promise.reject("string-error"));

        await expect(tracked.Promise).rejects.toBe("string-error");

        expect(tracked.Status).toBe(PromiseStatus.Rejected);
        expect(tracked.Error).toBe("string-error");
        expect(tracked.Result).toBeUndefined();
    });

    it("should handle synchronous resolved promise", async () => {
        const tracked = new TrackedPromise(Promise.resolve(123));

        // Await so status updates
        await tracked.Promise;

        expect(tracked.Status).toBe(PromiseStatus.Fulfilled);
        expect(tracked.Result).toBe(123);
    });
});
