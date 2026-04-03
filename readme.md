## Wordle-like

A clone of Wordle

### Setup

**Prerequisites:** Node.js 18+ and npm 9+

```bash
# Install all dependencies and link workspace packages
npm install

# Start the backend (http://localhost:3000)
cd backend && npm run dev

# In a separate terminal, start the frontend (http://localhost:5173)
cd frontend && npm run dev
```

### Features

- 6 attempts to guess a 5-letter word
- Colour-coded tile feedback — green (correct position), yellow (wrong position), grey (not in word)
- Keyboard input — type and press Enter to submit, Backspace to delete
- Invalid words are rejected before submission
- Target word is redacted from API responses until the game ends
- Win/loss message on completion with the target word revealed
- New game and play again buttons
- Duplicate letter handling — consistent with standard Wordle rules

### Roadmap (What I'd do given more time)

- Persistent sessions
- Statistics
- On-screen keyboard
- More fleshed out UI

A persistent session would be good to allow the player to come back to the game. This would require some sort of database or use browser's local storage. Having persistence give us all the data we need to calculate statistics such as win-rate and guess distribution.

An on-screen keyboard would be good but given the scope of this project, it feels like overkill. Especially because this is an application run on a desktop which would have access to a keyboard.

There is always room for improvement on the UI. Logos, navbars, more statistics on-screen.

### Choices

Chosen tech stack:
Express backend
React frontend with Mantine UI library

#### Express

Chosen because it is a simple and widely used framework for Node.js backends. Fastify was also considered as it is faster and has a nicer built-in schema validation story, but that performance difference only really matters at scale, probably not a factor in a simple wordle-clone. Express also has broader familiarity, so the code is easier to pick up for anyone who hasn't used Fastify before. If this were a high-throughput production API I'd revisit that decision, but for this it would've been over-engineering.

#### Mantine UI

Chosen because I quite like the Mantine UI library. They have good documentation and also many UI components available. Definitely room for growth and adding features to the UI if given more time as the library is quite extensible.

Tailwind was the obvious alternative, but involves building components from scratch. For a project like this where the UI needs to be built quickly, Mantine gives you the components with sensible defaults and good TypeScript support out of the box. The `useWindowEvent` hook from `@mantine/hooks` is a good example of where it real time.

#### Monorepo with npm workspaces

Sharing the game model types between frontend and backend without duplicating them was the main driver here. The trade-off is a slightly more involved initial setup, but `npm install` from the root handles everything.

This is an npm workspace monorepo with three packages: `frontend`, `backend`, and `shared`.
Run `npm install` from the root to link all packages. Shared types (game model) live in `shared/`
and are imported by both frontend and backend as `@wordle/shared`.

### Data Sources

Wordle possible answers from: https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b

Wordle allowed guesses from: https://gist.github.com/cfreshman/cdcdf777450c5b5301e439061d29694c

### Testing

**Backend** — Jest with `ts-jest`, tests live in `backend/tests/`

```bash
cd backend && npm test
```

Three test suites:

- `word.service.test.ts` — unit tests for `evaluateGuess` (green/yellow/grey logic, duplicate handling, case insensitivity) and `isValidWord`
- `game.service.test.ts` — unit tests for game lifecycle: creating games, redacting the target word, submitting guesses, win/loss detection, and error cases
- `game.routes.test.ts` — integration tests against the Express app using Supertest, covering all routes and HTTP error responses

**Frontend** — Vitest + React Testing Library, tests co-located with components

```bash
cd frontend && npm test
```

Component unit tests:

- `Tile.test.tsx` — renders letters uppercased, handles empty and submitted states
- `Board.test.tsx` — correct grid dimensions, submitted guess letters, in-progress guess letters
- `GameComplete.test.tsx` — win/loss messages, target word reveal, play again callback
