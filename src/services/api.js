import axios from "axios"

const api = axios.create({

baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

timeout: 10000,

headers:{
"Content-Type":"application/json"
}

})

/*
REQUEST INTERCEPTOR
bisa dipakai untuk token auth nanti
*/

api.interceptors.request.use(

(config)=>{

console.log("REQUEST →",config.url)

return config

},

(error)=>{

return Promise.reject(error)

}

)

/*
RESPONSE INTERCEPTOR
handle response dan error
*/

api.interceptors.response.use(

(response)=>{

console.log("RESPONSE ←",response.data)

return response

},

(error)=>{

if(error.response){

console.error("API ERROR:",error.response.data)

}else if(error.request){

console.error("SERVER TIDAK RESPOND")

}else{

console.error("REQUEST ERROR:",error.message)

}

return Promise.reject(error)

}

)

export default api
