import { useEffect, useState } from "react"
import { TextEditor } from "./TextEditor"
import { defaultText } from "../util/defaultText"

const parseMojangson = (str) => {
    try {
        return JSON.parse(
            str
                .replace(/([{,])([a-zA-Z0-9_]+):/g, '$1"$2":')
                .replace(/(\d+)b/g, '$1')
        )
    } catch {
        return {}
    }
}

const buildItem = (edited) => {
    const textToMojangson = (t) =>
        JSON.stringify({
            extra: [{
                text: t.text,
                color: t.color,
                bold: t.bold ? 1 : 0,
                italic: t.italic ? 1 : 0,
                underlined: t.underlined ? 1 : 0,
                strikethrough: t.strikethrough ? 1 : 0,
                obfuscated: t.obfuscated ? 1 : 0
            }],
            text: ""
        }).replace(/"(\d)"/g, "$1b")

    const lore = edited.lore.map(textToMojangson)

    const pdc = {}

    Object.entries(edited.pdc).forEach(([k, v]) => {
        pdc[`minecraftfish:${k}`] = v
    })

    return {
        DataVersion: 4671,
        id: `minecraft:${edited.id}`,
        count: edited.count,
        components: {
            "minecraft:custom_name": textToMojangson(edited.name),
            "minecraft:lore": `[${lore.join(",")}]`,
            "minecraft:custom_data": `{PublicBukkitValues:${JSON.stringify(pdc)}}`
        },
        schema_version: 1
    }
}

const parseItemDeep = (item) => {
    if (!item) return null

    const components = item.components || {}
    const name = components["minecraft:custom_name"]
        ? parseTextComponent(components["minecraft:custom_name"])
        : defaultText()

    const loreRaw = components["minecraft:lore"]
        ? parseMojangson(components["minecraft:lore"])
        : []

    const lore = loreRaw.map(line => parseTextComponent(JSON.stringify(line)))

    let pdc = {}

    if (components["minecraft:custom_data"]) {
        const parsed = parseMojangson(components["minecraft:custom_data"])

        const values = parsed?.PublicBukkitValues || {}

        Object.entries(values)
            .forEach(([k, v]) => {
                pdc[k.replace("minecraftfish:", "")] = v
            })
    }

    return {
        id: item.id.replace("minecraft:", ""),
        count: item.count,
        name,
        lore,
        pdc
    }
}

const parseTextComponent = (str) => {
    const json = parseMojangson(str)
    const extra = json?.extra?.[0] || {}

    return {
        text: extra.text || "",
        color: extra.color || "white",
        bold: !!extra.bold,
        italic: !!extra.italic,
        underlined: !!extra.underlined,
        strikethrough: !!extra.strikethrough,
        obfuscated: !!extra.obfuscated
    }
}

export const ItemEditor = ({ selected, updateInventory }) => {
    if (!selected) return null
    const parsedItem = parseItemDeep(selected.data)
    if (!parsedItem) return <div>empty</div>

    // LOCAL STATE
    const [item, setItem] = useState(parsedItem)

    // Reset local state if selected changes
    useEffect(() => {
        setItem(parseItemDeep(selected.data))
    }, [selected])

    const update = (k, v) => {
        const newItem = { ...item, [k]: v }
        setItem(newItem)
        const built = buildItem(newItem)
        updateInventory(selected.index, built)
    }

    return (
        <div style={{ width: "100%", border: "1px solid black", padding: 10, backgroundColor: "yellow" }}>
            <h3>Item</h3>

            <div>material: {item.id}</div>

            <div>
                count
                <input
                    type="number"
                    value={item.count}
                    onChange={e => update("count", Number(e.target.value))}
                />
            </div>

            <h4>name</h4>
            <TextEditor
                value={item.name}
                onChange={v => update("name", v)}
            />

            <h4>lore</h4>
            {item.lore.map((line, i) => (
                <div key={i}>
                    <TextEditor
                        value={line}
                        onChange={v => {
                            const newLore = [...item.lore]
                            newLore[i] = v
                            update("lore", newLore)
                        }}
                    />
                    <button onClick={() => {
                        const newLore = item.lore.filter((_, x) => x !== i)
                        update("lore", newLore)
                    }}>remove</button>
                </div>
            ))}
            <button onClick={() => update("lore", [...item.lore, defaultText()])}>add lore</button>

            <h4>pdc</h4>
            {Object.entries(item.pdc).map(([k, v]) => (
                <div key={k}>
                    <input
                        value={k}
                        onChange={e => {
                            const newPdc = { ...item.pdc }
                            delete newPdc[k]
                            newPdc[e.target.value] = v
                            update("pdc", newPdc)
                        }}
                    />
                    <input
                        value={v}
                        onChange={e => update("pdc", { ...item.pdc, [k]: e.target.value })}
                    />
                    <button onClick={() => {
                        const newPdc = { ...item.pdc }
                        delete newPdc[k]
                        update("pdc", newPdc)
                    }}>remove</button>
                </div>
            ))}
            <button onClick={() => update("pdc", { ...item.pdc, new_key: "value" })}>add pdc</button>
        </div>
    )
}