/redux
rootReducer.ts
Function: Combine all Redux slices.
Expected Output: Root reducer combining all feature slices.

```typescript
export const rootReducer = combineReducers({
  user: userReducer,
  // other reducers
});
```

store.ts
Function: Configure Redux store.
Expected Output: Configured Redux store.

```typescript
export const store = configureStore({
  reducer: rootReducer,
  // other configurations
});
```
