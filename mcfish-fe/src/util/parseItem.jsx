export const parseItem = (item) => {
    if (!item) return null

    const components = item.components || {}

    let customData = {}
    let lore = []
    let name = ""

    try {
        if (components["minecraft:custom_data"]) {
            const parsed = JSON.parse(
                components["minecraft:custom_data"]
                    .replace(/([a-zA-Z0-9_]+):/g, '"$1":') // fix Mojangson keys
                    .replace(/1b/g, "1") // convert byte → number
            )

            customData = parsed?.PublicBukkitValues || {}
        }
    } catch { }

    try {
        if (components["minecraft:lore"]) {
            lore = JSON.parse(components["minecraft:lore"])
                .map(line => line.extra?.[0]?.text || "")
        }
    } catch { }

    try {
        if (components["minecraft:custom_name"]) {
            name = JSON.parse(components["minecraft:custom_name"])
                ?.extra?.[0]?.text || ""
        }
    } catch { }

    return {
        id: item.id.replace("minecraft:", ""),
        count: item.count,
        name,
        lore,
        pdc: customData
    }
}