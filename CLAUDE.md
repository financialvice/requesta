# Project Context

## {{project_name}}
{{project_description}}

## Expected Workflow
You should frequently lint and typecheck. You can liberally use `bun run lint:fix:unsafe` because our linter is very strict. NEVER consider a task complete unless we are passing linting and typechecking. If you have made many attempts to fix a linting or typechecking error, you can stop and ask for help. Be very clear about the solutions you attempted.

## Project Structure

### Monorepo Structure
```
{{project_name}}/
├── apps/
│   └── web/                      # Next.js web application
├── packages/
│   ├── db/                       # Database (InstantDB) layer
│   ├── scripts/                  # Special scripts
│   ├── trpc/                     # tRPC API layer
│   ├── typescript-config/        # Shared TS configs
│   ├── ui/                       # Shared UI components
│   └── vitest-config/            # Test configuration
├── biome.jsonc                   # Linter/formatter config
├── turbo.json                    # Turborepo config
├── lefthook.yml                  # Git hooks
└── package.json                  # Root workspace
```

### Typical Package Structure
```
packages/
└── package-name/
    ├── src/                      # Source code (TypeScript)
    ├── tests/                    # Test files
    ├── AGENTS.md                 # Symlink to CLAUDE.md
    ├── CLAUDE.md                 # AI-optimized package-specific instructions
    ├── package.json              # Package dependencies & scripts
    └── tsconfig.json             # TypeScript configuration
```

**Note:** Packages are consumed as TypeScript source directly - we do NOT build packages unless absolutely required (which is incredibly rare). Consuming apps compile the TypeScript code themselves.

### Available Scripts

#### Scripts
- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps and packages
- `bun run lint` - Run linting across all packages
- `bun run lint:fix` - Auto-fix linting issues
- `bun run lint:fix:unsafe` - Auto-fix with unsafe rules
- `bun run typecheck` - Type-check all packages
- `bun run clean` - Remove all node_modules

## Package Management

### Bun Workspaces (with Isolated Installs)
Use Bun workspaces to manage our monorepo. You have an `apps` workspace and a `packages` workspace. You use Bun's isolated installs package installation strategy that creates strict dependency isolation similar to pnpm's approach. This prevents phantom dependencies, provides deterministic resolution, and is better for monorepos.

### Bun Catalogs
Use Bun's `catalog:` functionality to ensure shared dependency versions across the workspaces in the monorepo.

Define version catalogs in the root `package.json`, then reference these versions with a simple `catalog:` protocol. Update all packages simultaneously by changing the version in just one place.

When adding dependencies to a package, use `bun add [dependency]@catalog:`. If we haven't yet defined a version catalog for a dependency, you will receive feedback. You should add the latest (or expected) version of the package as a version catalog in the root `package.json`. Always use pinned, specific versions.

## Linting and Typechecking
We use Ultracite, a preset for Biome's lightning fast formatter and linter, which enforces strict type safety, accessibility standards, and consistent code quality for TypeScript projects.

### Before Writing Code
1. Analyze existing patterns in the codebase
2. Consider edge cases and error scenarios
3. Follow the rules below strictly

### Biome / Ultracite Linting Rules

#### Accessibility (a11y)
- Make sure label elements have text content and are associated with an input.
- Give all elements requiring alt text meaningful information for screen readers.
- Always include a `type` attribute for button elements.
- Accompany `onClick` with at least one of: `onKeyUp`, `onKeyDown`, or `onKeyPress`.
- Accompany `onMouseOver`/`onMouseOut` with `onFocus`/`onBlur`.
- Use semantic elements instead of role attributes in JSX.

#### Code Complexity and Quality
- Don't use any or unknown as type constraints.
- Don't use primitive type aliases or misleading types.
- Don't use empty type parameters in type aliases and interfaces.
- Don't write functions that exceed a given Cognitive Complexity score.
- Don't nest describe() blocks too deeply in test files.
- Use for...of statements instead of Array.forEach.
- Don't use unnecessary nested block statements.
- Don't rename imports, exports, and destructured assignments to the same name.
- Don't use unnecessary string or template literal concatenation.
- Don't use useless case statements in switch statements.
- Don't use ternary operators when simpler alternatives exist.
- Don't initialize variables to undefined.
- Use arrow functions instead of function expressions.
- Use Date.now() to get milliseconds since the Unix Epoch.
- Use .flatMap() instead of map().flat() when possible.
- Use concise optional chaining instead of chained logical expressions.
- Remove redundant terms from logical expressions.
- Use while loops instead of for loops when you don't need initializer and update expressions.
- Don't pass children as props.
- Don't declare functions and vars that are accessible outside their block.
- Don't use variables and function parameters before they're declared.

#### React and JSX Best Practices
- Don't use the return value of React.render.
- Make sure all dependencies are correctly specified in React hooks.
- Make sure all React hooks are called from the top level of component functions.
- Don't forget key props in iterators and collection literals.
- Don't define React components inside other components.
- Don't use dangerous JSX props.
- Don't use Array index in keys.
- Don't insert comments as text nodes.
- Don't assign JSX properties multiple times.
- Don't add extra closing tags for components without children.
- Use `<>...</>` instead of `<Fragment>...</Fragment>`.
- Watch out for possible "wrong" semicolons inside JSX elements.

#### Correctness and Safety
- Don't write unreachable code.
- Don't use optional chaining where undefined values aren't allowed.
- Don't have unused function parameters.
- Don't have unused imports.
- Don't have unused labels.
- Don't have unused variables.
- Make sure typeof expressions are compared to valid values.
- Make sure generator functions contain yield.
- Don't use await inside loops. If running sequence-dependent async operations, build a promise chain.
- Make sure Promise-like statements are handled appropriately.
- Don't use __dirname and __filename in the global scope.
- Prevent import cycles.
- Don't use configured elements.
- Don't hardcode sensitive data like API keys and tokens.
- Don't let variable declarations shadow variables from outer scopes.
- Don't use the TypeScript directive @ts-ignore.
- Don't use useless undefined.
- Make sure switch-case statements are exhaustive.
- Use `Array#{indexOf,lastIndexOf}()` instead of `Array#{findIndex,findLastIndex}()` when looking for the index of an item.
- Make sure iterable callbacks return consistent values.
- Use object spread instead of `Object.assign()` when constructing new objects.
- Always use the radix argument when using `parseInt()`.
- Make sure JSDoc comment lines start with a single asterisk, except for the first one.
- Don't use spread (`...`) syntax on accumulators.
- Don't use namespace imports.
- Declare regex literals at the top level.

#### TypeScript Best Practices
- Don't use TypeScript enums.
- Don't export imported variables.
- Don't use TypeScript namespaces.
- Don't use non-null assertions with the `!` postfix operator.
- Don't use user-defined types.
- Use `as const` instead of literal types and type annotations.
- Use either `T[]` or `Array<T>` consistently.
- Initialize each enum member value explicitly.
- Use `export type` for types.
- Use `import type` for types.
- Make sure all enum members are literal values.
- Don't use TypeScript const enum.
- Don't declare empty interfaces.
- Don't let variables evolve into any type through reassignments.
- Don't use the any type.
- Don't misuse the non-null assertion operator (!) in TypeScript files.
- Don't use implicit any type on variable declarations.

#### Style and Consistency
- Don't use callbacks in asynchronous tests and hooks.
- Don't use negation in `if` statements that have `else` clauses.
- Don't use nested ternary expressions.
- Don't reassign function parameters.
- Use `String.slice()` instead of `String.substr()` and `String.substring()`.
- Don't use template literals if you don't need interpolation or special-character handling.
- Don't use `else` blocks when the `if` block breaks early.
- Use `at()` instead of integer index access.
- Follow curly brace conventions.
- Use `else if` instead of nested `if` statements in `else` clauses.
- Use single `if` statements instead of nested `if` clauses.
- Use `new` for all builtins except `String`, `Number`, and `Boolean`.
- Use consistent accessibility modifiers on class properties and methods.
- Use `const` declarations for variables that are only assigned once.
- Put default function parameters and optional function parameters last.
- Include a `default` clause in switch statements.
- Use `for-of` loops when you need the index to extract an item from the iterated array.
- Use `node:assert/strict` over `node:assert`.
- Use the `node:` protocol for Node.js builtin modules.
- Use template literals over string concatenation.
- Use `new` when throwing an error.
- Don't throw non-Error values.
- Use `String.trimStart()` and `String.trimEnd()` over `String.trimLeft()` and `String.trimRight()`.
- Use standard constants instead of approximated literals.
- Don't assign values in expressions.
- Use `===` and `!==`.
- Don't use duplicate case labels.
- Don't use duplicate conditions in if-else-if chains.
- Don't use two keys with the same name inside objects.
- Don't use duplicate function parameter names.
- Don't let switch clauses fall through.
- Don't use labels that share a name with a variable.
- Don't redeclare variables, functions, classes, and types in the same scope.
- Don't let identifiers shadow restricted names.
- Don't use unsafe negation.
- Don't use var.
- Make sure async functions actually use await.
- Make sure default clauses in switch statements come last.

#### Next.js Specific Rules
- Don't use `<img>` elements in Next.js projects.
- Don't use `<head>` elements in Next.js projects.

#### Testing Best Practices
- Don't use export or module.exports in test files.
- Don't use focused tests.
- Make sure the assertion function, like expect, is placed inside an it() function call.
- Don't use disabled tests.