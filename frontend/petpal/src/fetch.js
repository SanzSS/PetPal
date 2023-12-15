const domain = "http://3.16.70.156:8000/api";

export async function fetchWithAuthorization(url, settings, navigate, loginToken) {
    const token = "Bearer " + loginToken;

    if (!settings.headers) {
        settings.headers = {};
    }

    settings.headers['Authorization'] = token;

    const response = await fetch(domain + url, settings);

    switch (response.status) {
        case 401:
        case 403:
            // Redirect to the login page if unauthorized
            navigate('/login');
            break;
        default:
            break;
    }

    return response;
}
