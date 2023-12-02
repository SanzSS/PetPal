import ListingForm from '../../components/ListingForm'

const CreateListing = () => {
    return <>
        <main class="flex flex-col items-center pb-16">
            <h1 class="text-4xl sm:text-6xl my-12 text-blue3 font-extrabold">Create a Pet Listing</h1>
            <ListingForm />
        </main>
    </>
}

export default CreateListing;