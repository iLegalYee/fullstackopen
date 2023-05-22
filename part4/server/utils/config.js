const password = process.argv[2];
const mongoUrl = `mongodb+srv://fullstackopen:${password}@cluster0.nxazoik.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
    mongoUrl
}