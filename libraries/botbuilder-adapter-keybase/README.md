# Keybase Adapter
The Keybase adapter lets you create a chatbot that works with the Keybase end-to-end encrypted application.

## Installation
To install:

    npm install @botbuildercommunity/adapter-keybase --save

## Usage
Include it in your bot:

```typescript
import { KeybaseAdapter } from "@botbuildercommunity/adapter-keybase";
```
Create the adapter:

```typescript
const adapter: KeybaseAdapter = new KeybaseAdapter();
```

Listen for activities:

```typescript
adapter.processActivity(async (context: TurnContext) => {
    ...
});
```

From there you can pass the `context` to your bot logic's `onTurn()` method.
