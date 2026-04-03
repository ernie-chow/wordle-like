import app from "./app";

const port = 3000;

app.listen(port, () => {
    console.log(`Wordle-like server running on port ${port}`);
});