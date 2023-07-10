/** Retrieves the username from github */
export async function getUsernameById(id: string){
    const res = await fetch(`https://api.github.com/user/${id}`)
    return await res.json()
}