import axios from "axios"

const BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8000/backend/api"
        : "https://loreflow.app/backend/api"

const AxiosMotion = axios.create({
    baseURL: BASE_URL
})

export default AxiosMotion
