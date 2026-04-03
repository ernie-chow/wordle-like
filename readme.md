A Wordle clone.

Chosen tech stack:
Express backend
React frontend with Tailwind CSS

This is an npm workspace monorepo with three packages: `frontend`, `backend`, and `shared`.
Run `npm install` from the root to link all packages. Shared types (game model) live in `shared/`
and are imported by both frontend and backend as `@wordle/shared`.

Wordle possible answers from: https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b

Wordle allowed guesses from: https://gist.github.com/cfreshman/cdcdf777450c5b5301e439061d29694c