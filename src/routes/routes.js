/* Set up basic root routes for the app */
module.exports = {
  root: (req, res) => {
    res.json({ message: `Eezer API, version ${process.env.npm_package_version}.` });
  }
};
