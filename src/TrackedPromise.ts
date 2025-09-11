import PromiseStatus from "./PromiseStatus";

class TrackedPromise<T> {
    private m_status: PromiseStatus;
    private m_result?: T;
    private m_error?: any;
    private readonly m_promise: Promise<T>;

    public constructor(promise: Promise<T>) {
        this.m_status = PromiseStatus.Pending;
        this.m_promise = promise.then(
            (res) => {
                this.m_status = PromiseStatus.Fulfilled;
                this.m_result = res;
                return res;
            },
            (err) => {
                this.m_status = PromiseStatus.Rejected;
                this.m_error = err;
                throw err;
            }
        );
    }

    public get Status(): PromiseStatus {
        return this.m_status;
    }

    public get Result(): T | undefined {
        return this.m_result;
    }

    public get Error(): any {
        return this.m_error;
    }

    public get Promise(): Promise<T> {
        return this.m_promise;
    }
}

export default TrackedPromise;