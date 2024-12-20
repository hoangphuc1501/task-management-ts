import { sendMail } from './../../helpers/sendMail.helper';
import { User } from "../../models/user.model";
import { Request, Response } from "express";
import { ForgotPassword } from '../../models/forgot-password.model';
import md5 from "md5";


import {generateRandomString} from "../../helpers/generate.helper"
import { generateRandomNumber } from '../../helpers/generate.helper';


export const register = async (req: Request, res: Response) => {
    const user = req.body

    const existUser = await User.findOne({
        email: user.email,
        deleted: false
    })
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
        password: md5(user.password),
        token: generateRandomString(30),
        status: "active"
    }
    const newsUser = new User(dataUser);
    await newsUser.save();


    res.json({
        code: "success",
        message: "Đăng ký thành công!",
        token: newsUser.token
    })
}

export const login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    const existUser = await User.findOne({
        email: email,
        deleted: false
    })
    if (!existUser) {
        res.json({
            code: "error",
            message: "Email không tồn tại trong hệ thống!"
        });
        return;
    }
    if (md5(password) != existUser.password) {
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
    })
}

export const forgotPassword = async (req:Request, res: Response) => {
    const email = req.body.email;

    const existUser = await User.findOne({
        email: email,
        status: "active",
        deleted: false
    })

    if (!existUser) {
        res.json({
            code: "error",
            message: "Email không tồn tại!"
        });
        return;
    }

    // việc 1 lưu thông tin email vàmã otp vào database
    const existEmailInForgotPassword = await ForgotPassword.findOne({
        email: email
    });
    if (!existEmailInForgotPassword) {
        const otp = generateRandomNumber(6);

        const data = {
            email: email,
            otp: otp,
            expireAt: Date.now() + 5 * 60 * 1000
        }
        const record = new ForgotPassword(data)
        await record.save();

        // việc 2: gửi mã otp qua email cho user
        const subject = "Xác thực mã OTP";
        const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;
        sendMail(email, subject, text);
    }
    res.json({
        code: "success",
        message: "Gửi mã OTP thành công!",
    })
}

export const otpPassword = async (req: Request, res: Response) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const existRecord = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if(!existRecord){
        res.json({
            code: "error",
            message: "Mã OTP không hợp lệ!",
        })
        return;
    }
    const user = await User.findOne({
        email: email
    })
    res.json({
        code: "success",
        message: "Mã OTP hợp lệ!",
        token: user.token
    })
}

export const resetPassword = async (req: Request, res: Response) => {
    const password = req.body.password;
    const token = req.body.token;

    const existRecord = await User.findOne({
        token: token
    })
    if(!existRecord){
        res.json({
            code: "error",
            message: "Token không hợp lệ!",
        })
        return;
    }

    await User.findOne({
        token: token,
        status: "active",
        deleted: false
    },{
        password: md5(password)
    })
    res.json({
        code: "success",
        message: "Đổi mật khẩu thành công!",
    })
}

export const profile = async (req: Request, res: Response) => {
    const token = req.body.token;
    if(!token){
        res.json({
            code: "error",
            message: "Vui lòng gửi kèm theo token!",
        })
        return;
    }
    const user = await User
    .findOne({
        token: token,
        deleted: false
    })
    .select("id fullName email")
    if(!user){
        res.json({
            code: "error",
            message: "Token không hợp lệ!",
        })
        return;
    }
    res.json({
        code: "success",
        message: "Thành công!",
        data: user
    })
}