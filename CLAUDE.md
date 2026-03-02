# Code Style Guidelines

## Always use braces for if statements

Every `if` statement must use braces, even for single-line bodies.

**Wrong:**
```ts
if (!value) return false;
if (condition) doSomething();
```

**Correct:**
```ts
if (!value) {
  return false;
}
if (condition) {
  doSomething();
}
```
