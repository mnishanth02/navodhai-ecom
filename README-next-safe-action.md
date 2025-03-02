# Next Safe Action Implementation

This document outlines the implementation of `next-safe-action` in our project for handling server actions with type
safety, validation, and authentication.

## Structure

1. **Safe Action Client** (`lib/safe-action.ts`)

   - Base client for non-authenticated actions
   - Authentication middleware for protected actions
   - Custom error handling
   - Metadata schema definition

2. **Server Actions** (`actions/`)

   - Auth actions (`auth.actions.ts`)
   - Store actions (`store.actions.ts`)
   - Legacy actions for backward compatibility (`legacy/`)

3. **Data Access Layer** (`lib/data-access/`)
   - Database operations for auth (`auth-queries.ts`)
   - Database operations for stores (`store-quries.ts`)

## Implementation Details

### Safe Action Client

We've created two clients:

- `actionClient`: For public actions (no authentication required)
- `authActionClient`: For protected actions (requires authentication)

The authentication middleware checks for a valid session and passes the user to the action.

```typescript
// Base action client without authentication
export const actionClient = createSafeActionClient({
  handleServerError(error: unknown) {
    // Log the error for debugging
    console.error("Server action error:", error);

    // Return custom error messages for known error types
    if (error instanceof ActionError) {
      return error.message;
    }

    if (error instanceof Error) {
      // Only return actual error messages in development
      if (process.env.NODE_ENV === "development") {
        return error.message;
      }
    }

    // Return a generic message in production
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  // Define metadata schema for actions
  defineMetadataSchema() {
    return z.object({
      actionName: z.string().optional(),
      requiresAuth: z.boolean().optional().default(false),
    });
  },
});
```

### Server Actions

Each server action follows this pattern:

1. Define metadata for the action
2. Define a schema for validation
3. Call the appropriate data access function
4. Handle errors and return a consistent response

Example:

```typescript
export const createStore = authActionClient
  .metadata({
    actionName: "createStore",
    requiresAuth: true,
  })
  .schema(StoreSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name } = parsedInput;
    const { userId } = ctx;

    if (!userId) {
      throw new ActionError("User ID is required");
    }

    const result = await createStoreQuery(name, userId);

    if (!result.success) {
      throw new ActionError(result.error?.message || "Failed to create store");
    }

    return {
      store: result.data,
      message: "Store created successfully",
    };
  });
```

### Client Components

Client components use the `useAction` hook to call server actions:

```typescript
const { execute, result } = useAction(createStore, {
  onExecute: () => {
    setIsSubmitting(true);
  },
  onSuccess: (data) => {
    setIsSubmitting(false);
    toast.success(data.data?.message || "Store created successfully");
    setName("");
  },
  onError: (error) => {
    setIsSubmitting(false);

    // Handle different types of errors
    if (error.error?.serverError) {
      toast.error(error.error.serverError);
    } else {
      toast.error("An unexpected error occurred");
    }
  },
  onSettled: () => {
    setIsSubmitting(false);
  },
});
```

### Server Components

Server components continue to use the data access functions directly:

```typescript
const storeResult = await getStoreByUserIdQuery(session.user.id as string);
```

## Benefits

1. **Type Safety**: Full type safety from client to server
2. **Validation**: Input validation using Zod schemas
3. **Authentication**: Centralized authentication middleware
4. **Error Handling**: Consistent error handling with custom error classes
5. **Metadata**: Action metadata for better debugging and logging
6. **Separation of Concerns**: Clear separation between data access and server actions

## Best Practices

1. **Use Metadata**: Add metadata to each action for better debugging and logging
2. **Custom Error Handling**: Use custom error classes for better error messages
3. **Environment-Aware Errors**: Show detailed errors in development, generic errors in production
4. **Proper Typing**: Use proper typing for all parameters and return values
5. **Ownership Verification**: Verify ownership of resources before performing operations
6. **Comprehensive Error Handling**: Handle different types of errors in client components

## Migration Strategy

We've maintained backward compatibility by:

1. Keeping the original server actions in a legacy directory
2. Re-exporting them from the new action files
3. Gradually migrating client components to use the new actions

## Usage Examples

See the following files for examples:

- `components/examples/create-store-form.tsx`: Client component example
- `app/examples/stores/page.tsx`: Server component example
