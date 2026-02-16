export default function rebots() {
    return {
        rules: [{ userAgent: "*", disallow: "/" }],
    };
}