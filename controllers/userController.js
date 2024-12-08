const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {

    
    console.log('req.body',req.body);
    const { email, password } = req.body;

    console.log(email, password,'email, password');
    const user = await User.findOne({ where: { email } });
    console.log(user,'user');

    if(!user){
      return res.status(401).json({ error: "user not exist" });
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      user: {
        token,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
