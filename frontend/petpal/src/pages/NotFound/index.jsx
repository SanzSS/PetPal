const NotFound = () => {
    return <>
        <div className="p-8 flex flex-col h-[80vh] justify-center items-center text-blue3">
            <h1 className="text-9xl font-bold">404</h1>
            <p className="text-4xl">Your requested page is not found.</p>
            <p className="text-2xl pt-8">Please double check the URL and try again.</p>
        </div>
    </>
}

export default NotFound;