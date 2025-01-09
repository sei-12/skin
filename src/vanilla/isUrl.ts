
export function isUrl(content: string) {
    if (content.startsWith("https://")) {
        return true
    }
    if (content.startsWith("http://")) {
        return true
    }

    return false
}