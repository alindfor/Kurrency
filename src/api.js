import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'https://api.exchangeratesapi.io/',
    timeout: 5000,
    headers: { 'Content-Type': 'application/jsom' }
});

export default {
    getRates() {
        return new Promise((resolve, reject) => {
            axiosInstance.get("latest")
                .then((response) => {
                    const { rates } = response.data
                    resolve(rates)
                }).catch((response) => {
                    console.log(JSON.stringify(response))
                    reject("Failed to get exchanges rates.")
                })
        })

    }
}