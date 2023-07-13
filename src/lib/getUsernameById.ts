/** Retrieves the username from github */
export async function getUsernameFromGithubByAccountProviderId({ providerAccountId }: { providerAccountId: string }) {
    const res = await fetch(`https://api.github.com/user/${providerAccountId}`)
    return await res.json()
}
/** 
 * Retrieves the accountProviderId from the image url 
 * 
 * @Example
 * input: { imageUrl: https://avatars.githubusercontent.com/u/2386742?v=4 }
 * output: '2386742'
*/
export function getAccountProviderIdFromImageUrl({ imageUrl }: { imageUrl: string }): string {
    return imageUrl.split('/')[4].split('?')[0]
}