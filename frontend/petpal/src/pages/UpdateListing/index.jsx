import ListingForm from '../../components/ListingForm'

const UpdateListing = () => {
    return <>
        <main class="flex flex-col items-center pb-16">
            <h1 class="text-4xl md:text-6xl my-12 text-blue3 font-extrabold">Update Pet Information</h1>
            <ListingForm />
        </main>
    </>
}

export default UpdateListing;