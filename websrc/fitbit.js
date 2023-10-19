const SCOPES = ['activity', 'heartrate', 'location', 'nutrition', 'profile', 'settings', 'sleep', 'social', 'weight'] 
const client_id = '23R8ZL';
const base_url = "https://vigourhall-8014c762e84c.herokuapp.com";
const fitbit_base_url = "https://api.fitbit.com/1/user/-/";

const generate_auth_url = async (scopes) =>
{
    // const redirect_uri = 'https://thompsonmina.github.io/VigourHall/';

    const serverUrl = base_url + '/get-challenge';
    const challengeResponse = await fetch(serverUrl);
    const { code_challenge, state, code_verifier } = await challengeResponse.json();

    // console.log(code_challenge, state);
    // console.log(code_verifier, "code verifier");
    let url = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=' + client_id
    url += `&code_challenge=${code_challenge}&code_challenge_method=S256&state=${state}`
    const scopesUrl = "scope="+ scopes.map(scope => `${scope}`).join('+');
    url += `&${scopesUrl}`

    return { code_verifier, url , state};
}
const get_access_token = async (redirect_uri, code_verifier) => {
    const url = new URL(redirect_uri);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const serverUrl = base_url + '/get-tokens';

    console.log(code_verifier)
    const tokenResponse = await fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, state, code_verifier })
    });
    // console.log(await tokenResponse.text()) 
    const response_json = await tokenResponse.json();
    const { access_token, refresh_token, scope, user_id } = response_json;
    return { access_token, refresh_token, scope, user_id };
}

const get_body_fat = async (access_token, startdate, enddate) => {
    const resourceUrl = fitbit_base_url + '/body/log/fat/date/' + startdate + '/' + enddate + '.json/';
    const bodyFatResponse = await fetch(resourceUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + access_token,
            'accept': 'application/json'
        },
    });
    const response_json = await bodyFatResponse.json();
    return response_json;
}

const get_water_consumption = async (access_token, startdate, enddate) => {
    const resourceUrl = fitbit_base_url + '/foods/log/water/date/' + startdate + '/' + enddate + '.json/';
    const waterResponse = await fetch(resourceUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + access_token,
            'accept': 'application/json'
        },
    });
    const response_json = await waterResponse.json();
    return response_json;

}

const get_sleep = async (access_token, startdate, enddate) => {
    const resourceUrl = fitbit_base_url + '/sleep/date/' + startdate + '/' + enddate + '.json/';
    const sleepResponse = await fetch(resourceUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + access_token,
            'accept': 'application/json'
        },
    });
    const response_json = await sleepResponse.json();
    return response_json;



}

// body fat
// water 
// sleep
// activity data

// generate_auth_url(SCOPES).then(url => console.log(url));
// get_access_token(
//     "https://thompsonmina.github.io/VigourHall/?code=e00da42420ea3a9b51cedded65baa8ce676edc7e&state=y8GyqqEriZX1LWou795hGg#_=_",
//     'znVSWX0MZac_emsQFhy1gJyYgFFkbfr0-IABbdA7Jd2AhgESyxq9F6v9cL7APeeV_mCEApalbCiEZc1pexppnf9ZwtNNCKVeN1D__tZIxAWGVWINsTx9FvkoLVu1NjAy'
// ).then(tokens => console.log(tokens));


// const access_token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1I4WkwiLCJzdWIiOiJCUVZIWDMiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJhY3QgcnNldCBybG9jIHJ3ZWkgcmhyIHJudXQgcnBybyByc2xlIiwiZXhwIjoxNjk2ODQxMDA5LCJpYXQiOjE2OTY4MTIyMDl9.wZyznwdGcaX9bv_8ohCn1kKGjI_4j96gltb2GTWEc_E";

// get_body_fat(access_token, '2023-10-01', '2023-10-09').then(tokens => console.log(tokens));
// get_water_consumption(access_token, '2023-10-01', '2023-10-09').then(tokens => console.log(tokens));
// get_sleep(access_token, '2023-10-01', '2023-10-09').then(tokens => console.log(tokens));
// // console.log(tokens);
export { generate_auth_url, get_access_token, SCOPES, client_id };