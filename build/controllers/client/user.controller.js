"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.resetPassword = exports.otpPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const sendMail_helper_1 = require("./../../helpers/sendMail.helper");
const user_model_1 = require("../../models/user.model");
const forgot_password_model_1 = require("../../models/forgot-password.model");
const md5_1 = __importDefault(require("md5"));
const generate_helper_1 = require("../../helpers/generate.helper");
const generate_helper_2 = require("../../helpers/generate.helper");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const existUser = yield user_model_1.User.findOne({
        email: user.email,
        deleted: false
    });
    if (existUser) {
        res.json({
            code: "error",
            message: "Email đã tồn tại!"
        });
        return;
    }
    const dataUser = {
        fullName: user.fullName,
        email: user.email,
        password: (0, md5_1.default)(user.password),
        token: (0, generate_helper_1.generateRandomString)(30),
        status: "active"
    };
    const newsUser = new user_model_1.User(dataUser);
    yield newsUser.save();
    res.json({
        code: "success",
        message: "Đăng ký thành công!",
        token: newsUser.token
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const existUser = yield user_model_1.User.findOne({
        email: email,
        deleted: false
    });
    if (!existUser) {
        res.json({
            code: "error",
            message: "Email không tồn tại trong hệ thống!"
        });
        return;
    }
    if ((0, md5_1.default)(password) != existUser.password) {
        res.json({
            code: "error",
            message: "Sai mật khẩu!"
        });
        return;
    }
    if (existUser.status != "active") {
        res.json({
            code: "error",
            message: "Tài khoản đã bị khóa!"
        });
        return;
    }
    res.json({
        code: "success",
        message: "Đăng nhập thành công!",
        token: existUser.token
    });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const existUser = yield user_model_1.User.findOne({
        email: email,
        status: "active",
        deleted: false
    });
    if (!existUser) {
        res.json({
            code: "error",
            message: "Email không tồn tại!"
        });
        return;
    }
    const existEmailInForgotPassword = yield forgot_password_model_1.ForgotPassword.findOne({
        email: email
    });
    if (!existEmailInForgotPassword) {
        const otp = (0, generate_helper_2.generateRandomNumber)(6);
        const data = {
            email: email,
            otp: otp,
            expireAt: Date.now() + 5 * 60 * 1000
        };
        const record = new forgot_password_model_1.ForgotPassword(data);
        yield record.save();
        const subject = "Xác thực mã OTP";
        const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;
        (0, sendMail_helper_1.sendMail)(email, subject, text);
    }
    res.json({
        code: "success",
        message: "Gửi mã OTP thành công!",
    });
});
exports.forgotPassword = forgotPassword;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const existRecord = yield forgot_password_model_1.ForgotPassword.findOne({
        email: email,
        otp: otp
    });
    if (!existRecord) {
        res.json({
            code: "error",
            message: "Mã OTP không hợp lệ!",
        });
        return;
    }
    const user = yield user_model_1.User.findOne({
        email: email
    });
    res.json({
        code: "success",
        message: "Mã OTP hợp lệ!",
        token: user.token
    });
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const token = req.body.token;
    const existRecord = yield user_model_1.User.findOne({
        token: token
    });
    if (!existRecord) {
        res.json({
            code: "error",
            message: "Token không hợp lệ!",
        });
        return;
    }
    yield user_model_1.User.findOne({
        token: token,
        status: "active",
        deleted: false
    }, {
        password: (0, md5_1.default)(password)
    });
    res.json({
        code: "success",
        message: "Đổi mật khẩu thành công!",
    });
});
exports.resetPassword = resetPassword;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    if (!token) {
        res.json({
            code: "error",
            message: "Vui lòng gửi kèm theo token!",
        });
        return;
    }
    const user = yield user_model_1.User
        .findOne({
        token: token,
        deleted: false
    })
        .select("id fullName email");
    if (!user) {
        res.json({
            code: "error",
            message: "Token không hợp lệ!",
        });
        return;
    }
    res.json({
        code: "success",
        message: "Thành công!",
        data: user
    });
});
exports.profile = profile;
