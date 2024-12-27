export function giveResponse(res, result) {
    return res.status(result.statusCode || 200).json({
        message: result.message || "Success",
        status: "success",
        data: result.data || null,
    });
}
