import { useEffect, useState } from 'react'
import { apiCall } from '../api/apiCall'
import { apiRoutes } from '../api/apiRoutes'

/* ------------------ parsing helpers ------------------ */

const defaultText = () => ({
    text: "",
    color: "white",
    bold: false,
    italic: false,
    underlined: false,
    strikethrough: false,
    obfuscated: false
})

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

const parseItemDeep = (item) => {

    if (!item) return null

    const components = item.components || {}

    const name = components["minecraft:custom_name"]
        ? parseTextComponent(
            components["minecraft:custom_name"]
        )
        : defaultText()

    const loreRaw =
        components["minecraft:lore"]
            ? parseMojangson(
                components["minecraft:lore"]
            )
            : []

    const lore = loreRaw.map(
        line => parseTextComponent(
            JSON.stringify(line)
        )
    )

    let pdc = {}

    if (components["minecraft:custom_data"]) {

        const parsed =
            parseMojangson(
                components["minecraft:custom_data"]
            )

        const values =
            parsed?.PublicBukkitValues || {}

        Object.entries(values)
            .forEach(([k, v]) => {

                pdc[
                    k.replace("minecraftfish:", "")
                ] = v
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

        })
            .replace(/"(\d)"/g, "$1b")

    const lore =
        edited.lore.map(textToMojangson)

    const pdc = {}

    Object.entries(edited.pdc)
        .forEach(([k, v]) => {

            pdc[
                `minecraftfish:${k}`
            ] = v
        })

    return {

        DataVersion: 4671,

        id: `minecraft:${edited.id}`,

        count: edited.count,

        components: {

            "minecraft:custom_name":
                textToMojangson(
                    edited.name
                ),

            "minecraft:lore":
                `[${lore.join(",")}]`,

            "minecraft:custom_data":
                `{PublicBukkitValues:${JSON.stringify(pdc)}}`
        },

        schema_version: 1
    }
}

/* ------------------ ui components ------------------ */

const colors = [
    "white", "gray", "dark_gray",
    "black", "red", "dark_red",
    "green", "dark_green",
    "blue", "dark_blue",
    "yellow", "gold",
    "aqua", "dark_aqua",
    "light_purple", "dark_purple"
]

const TextEditor = ({
    value,
    onChange
}) => {

    const update = (k, v) =>
        onChange({
            ...value,
            [k]: v
        })

    return (

        <div
            style={{
                border: "1px solid #ccc",
                padding: 6,
                marginBottom: 6
            }}>

            <input

                value={value.text}

                onChange={e =>
                    update(
                        "text",
                        e.target.value
                    )
                }
            />

            <select

                value={value.color}

                onChange={e =>
                    update(
                        "color",
                        e.target.value
                    )
                }
            >
                {colors.map(c =>

                    <option key={c}>
                        {c}
                    </option>

                )}
            </select>

            {[
                "bold",
                "italic",
                "underlined",
                "strikethrough",
                "obfuscated"
            ].map(flag => (

                <label
                    key={flag}
                    style={{ marginLeft: 6 }}>

                    <input

                        type="checkbox"

                        checked={value[flag]}

                        onChange={e =>
                            update(
                                flag,
                                e.target.checked
                            )
                        }
                    />

                    {flag}

                </label>

            ))}

        </div>
    )
}

const ItemEditor = ({ selected, updateInventory }) => {
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

export const ConfigTab = () => {
    const [cfg, setCfg] = useState(null)
    const [selected, setSelected] = useState(null)
    const getConfig = async () => {
        const res = await apiCall(apiRoutes.config.get)
        setCfg({
            ...res,
            player_inventory: JSON.parse(res.player_inventory)
        })
    }
    const saveConfig = async () => {
        if (!cfg) return;

        try {
            await apiCall(apiRoutes.config.update, 'POST', {
                player_inventory: cfg.player_inventory,
                version: cfg.version
            });
            alert("Saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to save: " + err.message);
        }
    };
    console.log(cfg?.player_inventory)
    useEffect(() => {
        getConfig()
    }, [])

    const updateInventory =
        (index, newItem) => {
            const inv = [...cfg.player_inventory]
            inv[index] = newItem
            setCfg({
                ...cfg,
                player_inventory: inv
            })
        }

    if (!cfg) return null

    return (

        <div
            style={{
                display: "flex",
                gap: 20
            }}>

            {/* inventory */}

            <div style={{ backgroundColor: "red", width: "65%" }}>

                {cfg?.player_inventory && (
                    <div style={{ marginTop: 12 }}>
                        {/* Inventory grid (slots 9–35) */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(9, 1fr)",
                                gap: 2,
                                marginBottom: 8
                            }}
                        >
                            {cfg.player_inventory.slice(9, 36).map((item, idx) => (
                                <div
                                    key={idx + 9}
                                    style={{
                                        aspectRatio: "1 / 1",
                                        border: "1px solid gray",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor:
                                            item?.components && Object.keys(item.components).length > 0
                                                ? "#8e7df3"
                                                : item
                                                    ? "#f0f0f0"
                                                    : "#fff",
                                    }}
                                    onClick={() =>
                                        setSelected({ index: idx + 9, data: item })
                                    }
                                >
                                    {item && (
                                        <div style={{ fontSize: 17, textAlign: "center" }}>
                                            {item.id.split(":")[1]}
                                            <br />
                                            x{item.count}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Hotbar (slots 0–8) */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(9, 1fr)",
                                gap: 2,
                                marginBottom: 8
                            }}
                        >
                            {cfg.player_inventory.slice(0, 9).map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        aspectRatio: "1 / 1",
                                        border: "1px solid gray",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor:
                                            item?.components && Object.keys(item.components).length > 0
                                                ? "#8e7df3"
                                                : item
                                                    ? "#f0f0f0"
                                                    : "#fff",
                                    }}
                                    onClick={() =>
                                        setSelected({ index: idx, data: item })
                                    }
                                >
                                    {item && (
                                        <div style={{ fontSize: 17, textAlign: "center" }}>
                                            {item.id.split(":")[1]}
                                            <br />
                                            x{item.count}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>


                    </div>
                )}

            </div>
            <div style={{ width: "33%" }}>
                {/* Deep editor */}
                {selected && (
                    <>
                        <ItemEditor
                            selected={selected}
                            updateInventory={updateInventory} // <-- just use the one you already defined
                        />
                        <div style={{ marginTop: 10 }}>
                            <button onClick={saveConfig}>Save Config</button>
                        </div>
                    </>
                )}

            </div>


        </div>

    )
}