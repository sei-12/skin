import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DbAPI } from "../ts/db"

export const SplashScreen = () => {
    const navi = useNavigate()

    // 準備の処理
    useEffect(() => {;(async () => {
        if ( await DbAPI.connect() === false ){
            return            
        }

        navi("/Home")
    })()},[] )

    return (
        <div>
            準備中
        </div>
    )
}