## JavaScript / TypeScript Coding Style

When writing new code or modifying existing code, prioritize readability over preserving legacy coding style.
Prefer modern, stable JavaScript and TypeScript features whenever they improve clarity.

---

### Prefer modern language features

Use these features when appropriate:

- `const` / `let` instead of `var`
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Logical assignment operators (`??=`, `||=`, `&&=`)
- `Array.prototype.at()`
- `Object.hasOwn()`
- `Array.prototype.findLast()` / `findLastIndex()`
- `Array.prototype.toSorted()` / `toReversed()` / `toSpliced()` / `with()`
- `structuredClone()` for deep copying
- `AbortController` for cancellable async operations
- `Error` with the `cause` option
- Top-level `await` in ES modules
- Prefer `Temporal` over `Date` for new date/time code. Use `@js-temporal/polyfill` until native support is sufficient.

#### TypeScript-specific

- `satisfies` operator for type-safe object literals
- `as const` for literal type inference
- Explicit generic type arguments when they improve clarity
- `unknown` instead of `any` for truly unknown values
- Template literal types where appropriate

---

### Modernize while editing

When modifying existing code, modernize nearby code where appropriate if:

- behavior does not change,
- readability improves,
- and the change remains small and easy to review.

Do not preserve older patterns solely for stylistic consistency.

---

### Compatibility

Use only standardized language features that are widely supported across:

- Node.js 20+
- TypeScript 5.x
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)

Do not use experimental, proposal-stage, or partially supported features.
In particular, do **not** use `Promise.withResolvers()` until it is broadly available.

---

### Refactoring scope

Do not perform large-scale style-only refactoring unrelated to the requested task.
Keep changes focused on the files and code being modified.

---

When multiple implementations are equally correct, prefer the one using modern, stable language features.
