const domain = "http://localhost:8000";

export async function fetchWithAuthorization(url, settings, navigate) {
    //const token = "Bearer " + localStorage.getItem('access');
    const token = "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxOTEyMDQyLCJpYXQiOjE3MDE4OTA0NDIsImp0aSI6Ijc5YmUxYzIxMjIwYjQyYTE4MzkwMTVmYTE1ZGQ4N2UzIiwidXNlcl9pZCI6M30.Pq8TtDjEgDE5xfXW6oV1A9nqCsi2O6-lwS3QJnbjDHc";

    if (!settings.headers) {
        settings.headers = {};
    }

    settings.headers['Authorization'] = token;

    const response = await fetch(domain + url, settings);

    switch (response.status) {
        case 401:
        case 403:
            // Redirect to the login page if unauthorized
            navigate('/login/');
            break;
        default:
            break;
    }

    return response;
}
