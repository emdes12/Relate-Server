export default (req, res, next) => {
  const { email, name, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    if (![email, name, password].every(Boolean)) {
        res.status(401).json("Missing Credentials");
        console.log("missing cred")
        return
    } else if (!validEmail(email)) {
        res.status(401).json("Invalid Email");
        console.log("invalid email")
        return
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
        res.status(401).json("Missing Credentials");
        console.log("missing cred")
        return
    } else if (!validEmail(email)) {
      res.status(401).json("Invalid Email");
      console.log("missing cred")
      return
    }
  }

  next();
};
