const server  = require('./server');
const PORT = 3000;

// Start the server
async function main() {
await server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
}

main();