import PromiseStatus from "./PromiseStatus";
import TrackedPromise from "./TrackedPromise";

class TrackedPromisePool {
    private m_pool: Array<TrackedPromise<any>>;

    public constructor() {
        this.m_pool = [];
    }

    public Add<T>(promise: Promise<T>): TrackedPromise<T> {
        const TRACKED: TrackedPromise<T> = new TrackedPromise<T>(promise);

        this.m_pool.push(TRACKED);

        return TRACKED;
    }

    public get Active(): TrackedPromise<any>[] {
        return this.m_pool.filter(p => p.Status === PromiseStatus.Pending);
    }

    public get Fulfilled(): TrackedPromise<any>[] {
        return this.m_pool.filter(p => p.Status === PromiseStatus.Fulfilled);
    }

    public get Rejected(): TrackedPromise<any>[] {
        return this.m_pool.filter(p => p.Status === PromiseStatus.Rejected);
    }

    public get All(): TrackedPromise<any>[] {
        return this.m_pool;
    }

    public get Resolved(): boolean {
        return (this.Active.length === 0);
    }

    public ClearResolved(): void {
        this.m_pool = this.m_pool.filter(p => p.Status === PromiseStatus.Pending);
    }
}

export default TrackedPromisePool;