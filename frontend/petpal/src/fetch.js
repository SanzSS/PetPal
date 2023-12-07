const domain = "http://localhost:8000";

export async function fetchWithAuthorization(url, settings, navigate) {
    //const token = "Bearer " + localStorage.getItem('access');
    const token = "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxOTk4MzY0LCJpYXQiOjE3MDE5NzY3NjQsImp0aSI6IjYwNjE1N2Y4OTkxNzQ3NDFhODk5MmUyN2IzYmZmZWI2IiwidXNlcl9pZCI6M30.GrVmRE9uYy7WWoh8UcHUY9GQbza1MmkrJPeLrVXvTkI";

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
