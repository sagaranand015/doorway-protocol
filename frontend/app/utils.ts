export const shortenAddress = (address: string) => {
    if (address)
        return address.substring(0, 6) + "..." + address.substring(address.length - 4, address.length)
}

export function GetUTCTimeNow() {
    return Math.floor((new Date()).getTime() / 1000);
}