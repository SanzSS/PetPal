const domain = "http://localhost:8000";

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
            navigate('/');
            break;
        default:
            break;
    }

    return response;
}
