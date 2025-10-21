import { apiRequest } from "./index.js";

export function login(body) {
    return apiRequest("/auth", {
        method: "POST",
        body: JSON.stringify(body),
    }); 
}