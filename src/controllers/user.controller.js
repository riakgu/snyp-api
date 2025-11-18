import userService from "../services/user.service.js";

async function updateUser(req, res, next) {
    try {
        const result = await userService.updateUser(req);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

async function updatePassword(req, res, next) {
    try {
        await userService.updatePassword(req);
        res.status(200).json({
            message: "Password updated successfully"
        });
    } catch (err) {
        next(err);
    }
}

async function getProfile(req, res, next) {
    try {
        const result = await userService.getProfile(req);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export default {
    updateUser,
    updatePassword,
    getProfile,
}