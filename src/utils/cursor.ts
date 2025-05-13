import { setANICursor, setANICursorWithGroupElement } from "ani-cursor.js";

export function setCursor() {
    try {
        setANICursor("body", "/src/assets/mouse/NormalSelect.ani");
        // let defaultGroup = [
        //     "body",
        // ];
        // setANICursorWithGroupElement(defaultGroup, "../src/assets/mouse/NormalSelect.ani")
        // 加载选择
        let loadAbleGroup = [
            ".el-loading-mask",
            // ".is-fullscreen",
        ];
        setANICursorWithGroupElement(loadAbleGroup, "/src/assets/mouse/Busy.ani")
        // 按钮选择
        let buttonAbleGroup = [
            "button",
            ".Logo",
            ".el-radio-button",
            'input[type="radio"]',
            ".el-radio-button__inner",
            "input[type='button']",
            "input[type='submit']",
            "input[type='reset']",
            "input[type='checkbox']",
            ".el-input__password",
            ".el-input__clear",
        ];
        setANICursorWithGroupElement(buttonAbleGroup, "/src/assets/mouse/AlternateSelect.ani")
        let textAbleGroup = [
            'input[type="text"]',
            "textarea",
            "p",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            ".el-input",
            ".el-input__wrapper",
        ];
        setANICursorWithGroupElement(textAbleGroup, "/src/assets/mouse/TextSelect.ani");
    }
    catch (error) {
        console.log(error)
    }

}