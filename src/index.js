const app = require("./app");

// listen to the port
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is launched on port ${port}`);
});
