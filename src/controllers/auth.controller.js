import authService from "../services/auth.service.js";

async function register(req, res, next) {
    try {
        const result = await authService.register(req.body);
        res.status(200).json({
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export default { register };