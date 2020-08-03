const Joi = require("@hapi/joi");
const userModel = require("./user.model");
const {
  Types: { ObjectId },
} = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/errors.constructor");
class UserController {
  constructor() {
    this._costFactor = 4;
  }

  get createUser() {
    return this._createUser.bind(this);
  }
  get loginUser() {
    return this._loginUser.bind(this);
  }
  get getCurrentUser() {
    return this._getCurrentUser.bind(this);
  }

  async _getCurrentUser(req, res, next) {
    const [userForResponse] = this.prepareUserResponse([req.user]);
    console.log(userForResponse);
    return res.status(200).json(userForResponse);
  }
  async _createUser(req, res, next) {
    try {
      const { email, password, subscription, token } = req.body;
      const userEmail = await userModel.findUserByEmail(email);
      if (userEmail) {
        return res.status(409).send({ message: "Email in use" });
      }
      const passwordHash = await bcryptjs.hash(password, this._costFactor);
      const user = await userModel.create({
        email,
        password: passwordHash,
        subscription,
        token,
      });
      return res.status(201).json({
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  async _loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);

      if (!user) {
        return res.status(401).send("Email or password is wrong");
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send("Email or password is wrong");
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60,
      });
      await userModel.updateToken(user._id, token);
      return res.status(200).json({
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.updateToken(user._id, null);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  async authorize(req, res, next) {
    try {
      // 1. витягнути токен користувача з заголовка Authorization
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      // 2. витягнути id користувача з пейлоада або вернути користувачу
      // помилку зі статус кодом 401
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }

      // 3. витягнути відповідного користувача. Якщо такого немає - викинути
      // помилку зі статус кодом 401
      // userModel - модель користувача в нашій системі
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError("User not authorized");
      }

      // 4. Якщо все пройшло успішно - передати запис користувача і токен в req
      // і передати обробку запиту на наступний middleware
      req.user = user;
      req.token = token;
      console.log("tok", token);
      next();
    } catch (err) {
      next(err);
    }
  }

  validateCreateUser(req, res, next) {
    const registrationRules = Joi.object({
      email: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = registrationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }
  validateLoginUser(req, res, next) {
    const loginRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = loginRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }
  prepareUserResponse(users) {
    return users.map((user) => {
      const { email, subscription } = user;
      return { email, subscription };
    });
  }
}
module.exports = new UserController();
