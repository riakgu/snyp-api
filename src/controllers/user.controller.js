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

export default {
    updateUser
}