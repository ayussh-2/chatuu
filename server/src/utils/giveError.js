export default function giveError(err, res) {
    console.error(err);

    const errorDetails = err.message || err.meta || err;

    res.status(500).json({
        message: "Server error",
        status: "error",
        error: errorDetails,
    });
}
