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

## Use if/else if instead of switch statements

Every `switch` statement should be written as an `if`/`else if` chain instead.

**Wrong:**
```ts
switch (node.type) {
  case "AND":
    return doAnd();
  case "OR":
    return doOr();
}
```

**Correct:**
```ts
if (node.type === "AND") {
  return doAnd();
} else if (node.type === "OR") {
  return doOr();
}
```
