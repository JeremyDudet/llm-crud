/features
/[FeatureName]/[FeatureName]Slice.ts
Function: Define Redux slice for the feature.
Expected Output: Redux slice with reducers and actions.

```typescript
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // reducers here
  },
});
```

/[FeatureName]/[FeatureName]Selectors.ts
Function: Define Redux selectors for the feature.
Expected Output: Memoized selector functions.

```typescript
export const selectUser = (state: RootState) => state.user;
```

/[FeatureName]/[FeatureName]Actions.ts
Function: Define Redux actions for the feature.
Expected Output: Action creator functions.

```typescript
export const { setUser, clearUser } = userSlice.actions;
```

/[FeatureName]/[FeatureName].types.ts
Function: Define TypeScript types for the feature.
Expected Output: TypeScript type definitions.

```typescript
export interface User {
  id: string;
  name: string;
}
```

/[FeatureName]/components/[Component].tsx
Function: Implement feature-specific components.
Expected Output: React functional components.

```typescript
const UserProfile: React.FC<UserProfileProps> = ({ user }) => (
// component implementation
);
```

/[FeatureName]/hooks/use[Feature].ts
Function: Implement feature-specific custom hooks.
Expected Output: Custom React hooks.

```typescript
export const useUser = () => {
  // hook implementation
};
```

/[FeatureName]/services/[Feature]Service.ts
Function: Implement feature-specific business logic.
Expected Output: Service functions.

```typescript
export const validateUser = (user: User) => {
  // validation logic
};
```
