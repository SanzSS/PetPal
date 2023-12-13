import ListingForm from '../../components/ListingForm'

const CreateListing = () => {
    let initialValues = {
        status: '',
        name: '',
        species: '',
        breed: '',
        years_old: '',
        months_old: '',
        gender: '',
        size: '',
        description: '',
        medical_history: '',
        behaviour: '',
        special_requirements: '',
    }
    return <>
        <main className="flex flex-col items-center pb-16">
            <h1 className="text-4xl sm:text-6xl my-12 text-blue3 font-extrabold">Create a Pet Listing</h1>
            <ListingForm initialValues={initialValues} create={true}/>
        </main>
    </>
}

export default CreateListing;