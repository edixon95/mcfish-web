const colors = [
    "white", "gray", "dark_gray",
    "black", "red", "dark_red",
    "green", "dark_green",
    "blue", "dark_blue",
    "yellow", "gold",
    "aqua", "dark_aqua",
    "light_purple", "dark_purple"
]

export const TextEditor = ({
    value,
    onChange
}) => {

    const update = (k, v) => onChange({ ...value, [k]: v })

    return (

        <div
            style={{
                border: "1px solid #ccc",
                padding: 6,
                marginBottom: 6
            }}>
            <input
                value={value.text}
                onChange={e => update("text", e.target.value)
                }
            />
            <select
                value={value.color}
                onChange={e => update("color", e.target.value)}
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
                        onChange={e => update(flag, e.target.checked)}
                    />
                    {flag}
                </label>
            ))}
        </div>
    )
}