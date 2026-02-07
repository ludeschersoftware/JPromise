A minimal utility for observing the lifecycle of a Promise — and managing collections of them.
Check whether a promise is **pending**, **fulfilled**, or **rejected**, and access its result or error **without blocking**.

---

## ✨ Features

* Track a single promise with `TrackedPromise`
* Manage multiple promises with `TrackedPromisePool`
* Check promise state **synchronously** in loops or render ticks
  *(no need to `await`)*
* Query promises by status: `Pending`, `Fulfilled`, `Rejected`
* Clear resolved tasks and keep only active ones
* Fully typed with TypeScript

---

## 📦 Installation

```bash
npm install @ludeschersoftware/promise
```

or with yarn:

```bash
yarn add @ludeschersoftware/promise
```

---

## 🔹 Usage

### 1. `TrackedPromise` — observe a single promise

```ts
import { TrackedPromise, PromiseStatus } from "@ludeschersoftware/promise";

const tracked = new TrackedPromise(fetch("/api/data").then(res => res.json()));

function loop() {
    if (tracked.Status === PromiseStatus.Fulfilled) {
        console.log("Data ready:", tracked.Result);
    } else if (tracked.Status === PromiseStatus.Rejected) {
        console.error("Failed:", tracked.Error);
    } else {
        console.log("Still loading...");
    }

    // Keep looping without blocking on the promise
    requestAnimationFrame(loop);
}

loop();
```

➡️ Unlike plain promises, you don’t need to `await` — you can check the status *non-blocking* inside a loop.

---

### 2. `TrackedPromisePool` — manage multiple promises

```ts
import { TrackedPromisePool } from "@ludeschersoftware/promise";

const pool = new TrackedPromisePool();

pool.Add(fetch("/assets/texture.png").then(r => r.blob()));
pool.Add(fetch("/assets/sound.mp3").then(r => r.blob()));

function gameLoop() {
    for (const p of pool.Fulfilled) {
        console.log("Loaded:", p.Result);
    }

    for (const p of pool.Rejected) {
        console.warn("Failed:", p.Error);
    }

    if (!pool.Resolved) {
        requestAnimationFrame(gameLoop); // keep looping until all done
    } else {
        console.log("All assets loaded!");
    }
}

gameLoop();
```

➡️ Perfect for **game loops** and **render cycles**, where you want to check async state every frame without blocking execution.

---

## 📖 API

### `enum PromiseStatus`

* `PromiseStatus.Pending`
* `PromiseStatus.Fulfilled`
* `PromiseStatus.Rejected`

---

### `class TrackedPromise<T>`

Wraps a `Promise<T>` and exposes its state.

* `Status: PromiseStatus`
* `Result?: T`
* `Error?: any`
* `Promise: Promise<T>`

---

### `class TrackedPromisePool`

Manages a collection of tracked promises.

* `Add<T>(promise: Promise<T>): TrackedPromise<T>`
* `Active: TrackedPromise<any>[]`
* `Fulfilled: TrackedPromise<any>[]`
* `Rejected: TrackedPromise<any>[]`
* `All: TrackedPromise<any>[]`
* `Resolved: boolean` *(true if no pending promises remain)*
* `ClearResolved(): void` *(removes all fulfilled & rejected promises, keeps only pending)*

---

## 🧪 Tests

The project uses [Jest](https://jestjs.io/).

```bash
npm test
npm run test:coverage
```

---

## 📦 Module Support

This package ships with both:

* CommonJS (`require`)
* ES Modules (`import`)

So it works in:

* Node.js projects
* Modern bundlers (Vite/Webpack/Rollup)
* TypeScript projects

---

## 📜 License

MIT © Johannes Ludescher