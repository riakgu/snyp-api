import linkService from "./link.service.js";
import statsService from "./stats.service.js";
import {ResponseError} from "../errors/response.error.js";
import * as bcrypt from "bcrypt";
import {validate} from "../utils/validators.js";
import {verifyPasswordLinkValidation} from "../validations/redirect.validation.js";

async function redirectLink(req) {

    const link = await linkService.getLinkByShortCode(req);

    await linkService.validateLinkAccess(link);

    if (link.has_password) {
        throw new ResponseError(403, 'Password is required');
    }

    await statsService.trackVisit(req);

    return link.long_url
}

async function verifyPasswordLink(req) {
    const { password } = validate(verifyPasswordLinkValidation, req.body);

    const link = await linkService.getLinkByShortCode(req);

    if (link.has_password) {
        const isValid = await bcrypt.compare(password, link.password);

        if (!isValid) {
            throw new ResponseError(401, 'Incorrect password');
        }
    }

    return {
        ...link,
        has_password: !!link.password,
        is_archived: !!link.archived_at,
    };
}

export default {
    redirectLink,
    verifyPasswordLink,
}