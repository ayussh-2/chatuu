import giveError from "./giveError.js";
import { giveResponse } from "./giveResponse.js";
export async function handleRequest(res, action) {
    try {
        const result = await action();
        if (result.redirect) {
            return res.redirect(result.redirect);
        }
        return giveResponse(res, result);
    } catch (error) {
        return giveError(error, res);
    }
}
