const SCOPES = ['activity', 'heartrate', 'location', 'nutrition', 'profile', 'settings', 'sleep', 'social', 'weight'] 
const client_id = '23R8ZL';

const generate_auth_url = async (scopes) =>
{
    // const redirect_uri = 'https://thompsonmina.github.io/VigourHall/';

    const serverUrl = ' http://localhost:5000/get-challenge';
    const challengeResponse = await fetch(serverUrl);
    const { code_challenge, state, code_verifier } = await challengeResponse.json();

    // console.log(code_challenge, state);
    console.log(code_verifier, "code verifier");
    let url = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=' + client_id
    url += `&code_challenge=${code_challenge}&code_challenge_method=S256&state=${state}`
    const scopesUrl = "scope="+ scopes.map(scope => `${scope}`).join('+');
    url += `&${scopesUrl}`

    return { code_verifier, url };
}
const get_access_token = async (redirect_uri, code_verifier) => {
    const url = new URL(redirect_uri);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const serverUrl = 'http://localhost:5000/get-tokens';

    console.log(code_verifier)
    const tokenResponse = await fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, state, code_verifier })
    });
    console.log(await tokenResponse.text()) 
    const response_json = await tokenResponse.json();
    const { access_token, refresh_token, scope, user_id } = response_json;
    return { access_token, refresh_token, scope, user_id };
}

// generate_auth_url(SCOPES).then(url => console.log(url));
// get_access_token(
//     "https://thompsonmina.github.io/VigourHall/?code=cf8e0484c8159a0cb64decc97398e752e85a143b&state=1aGn5uqtlxXIkztpewuUog#_=_",
//     'ZuM3Wj_Zr5x8U2y18UC8EWBLCX1ulWjTYyqEdfXhd-6_1XOh0Rh7bg7zxfEzE23r0LjFFVosrj8iExAK-Qltf3KtSWPegKQwGuYGhGGP4dcdxA0z72V6dMJrCmBdLrkt'
// ).then(tokens => console.log(tokens));

// console.log(tokens);
export { generate_auth_url, get_access_token, SCOPES, client_id };