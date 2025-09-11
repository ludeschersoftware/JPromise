import TrackedPromisePool from "../src/TrackedPromisePool";

describe("TrackedPromisePool", () => {
    it("starts with an empty pool", () => {
        const pool = new TrackedPromisePool();
        expect(pool.All).toEqual([]);
        expect(pool.Active).toEqual([]);
        expect(pool.Fulfilled).toEqual([]);
        expect(pool.Rejected).toEqual([]);
        expect(pool.Resolved).toBe(true); // nothing active
    });

    it("adds a pending promise", () => {
        const pool = new TrackedPromisePool();
        const tracked = pool.Add(new Promise(() => { })); // never resolves
        expect(pool.All).toContain(tracked);
        expect(pool.Active).toContain(tracked);
        expect(pool.Fulfilled).toEqual([]);
        expect(pool.Rejected).toEqual([]);
        expect(pool.Resolved).toBe(false);
    });

    it("handles a fulfilled promise", async () => {
        const pool = new TrackedPromisePool();
        const tracked = pool.Add(Promise.resolve("ok"));

        await tracked.Promise;

        expect(pool.Active).toEqual([]);
        expect(pool.Fulfilled).toContain(tracked);
        expect(pool.Rejected).toEqual([]);
        expect(pool.Resolved).toBe(true);
    });

    it("handles a rejected promise", async () => {
        const pool = new TrackedPromisePool();
        const tracked = pool.Add(Promise.reject("fail"));

        await expect(tracked.Promise).rejects.toBe("fail");

        expect(pool.Active).toEqual([]);
        expect(pool.Fulfilled).toEqual([]);
        expect(pool.Rejected).toContain(tracked);
        expect(pool.Resolved).toBe(true);
    });

    it("ClearResolved removes fulfilled and rejected promises but keeps pending", async () => {
        const pool = new TrackedPromisePool();

        const pending = pool.Add(new Promise(() => { }));
        const resolved = pool.Add(Promise.resolve(123));
        const rejected = pool.Add(Promise.reject("oops"));

        // wait for resolved/rejected
        await Promise.allSettled([resolved.Promise, rejected.Promise]);

        expect(pool.All.length).toBe(3);
        expect(pool.Fulfilled).toContain(resolved);
        expect(pool.Rejected).toContain(rejected);
        expect(pool.Active).toContain(pending);

        pool.ClearResolved();

        expect(pool.All.length).toBe(1);
        expect(pool.All).toContain(pending);
        expect(pool.Active).toContain(pending);
    });
});
