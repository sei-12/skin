/**
 * プロバイダーじゃないけどどこにおいたらいいか分からないし、新しいフォルダを作るのは違うと思った。
 * 一番性質的に似てる気がするからプロバイダーにおく
 * もしフォルダ分けするならエフェクターとか?
 */

import { useEffect } from "react";
import { useConfig } from "./configProvider";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { WindowVisibleController } from "../services/windowVisibleController";

export function GlobalHotkeySetter() {
    const config = useConfig();

    const reset = async () => {
        await unregisterAll().catch((e) => {
            console.error(e);
        });

        await register(config.keybinds.global.toggleWindowVisible, (e) => {
            if (e.state === "Released") {
                return;
            }
            WindowVisibleController.toggle();
        }).catch((e) => {
            console.warn("理由が分からない", e);
        });
    };

    useEffect(() => {
        reset();
    }, [config]);

    return <> </>;
}
