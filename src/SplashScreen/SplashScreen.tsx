import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const SplashScreen = () => {
    const navi = useNavigate()

    // 準備の処理
    useEffect(() => {;(async () => {
        navi("/Home")
    })()},[] )

    return (
        <div>
            準備中
        </div>
    )
}