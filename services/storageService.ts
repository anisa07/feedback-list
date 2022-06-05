export const getFromSessionStorage = (key: string) => {
    try {
        const item = sessionStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
    } catch(e) {
        console.error(`Problem getting value form storage`)
    }
}

export const saveToSessionStorage = (key: string, value: any) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch(e) {
        console.error(`Problem save value to storage`)
    }
}

export const getFromLocalStorage = (key: string) => {
    try {
        const item = localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
    } catch(e) {
        console.error(`Problem getting value form storage`)
    }
}

export const saveToLocalStorage = (key: string, value: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch(e) {
        console.error(`Problem save value to storage`)
    }
}
