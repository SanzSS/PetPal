const ListingForm = () => {
    return <>
        <form class="grid grid-cols-1 w-10/12 xl:w-3/4 2xl:w-2/4 max-w-[836px] p-6 rounded-md border-blue3 border-4 bg-blue2">
            <div class="flex flex-col">
                <label for="name" class="label">Pet Name</label>
                <input type="text" id="name" class="input box-border" required />
            </div>
            <div class="flex flex-col">
                <label for="photo" class="label">Photos</label>
                <input type="file" id="photo" class="input h-20 bg-white p-6" multiple required />
            </div>
            <div class="flex flex-col">
                <label for="breed" class="label">Breed</label>
                <input type="text" id="breed" class="input" required />
            </div>
            <div class="flex flex-col">
                <label for="age" class="label">Age</label>
                <input type="text" id="age" class="input" required />
            </div>
            <div class="flex flex-col">
                <label for="gender" class="label">Gender</label>
                <select id="gender" name="gender" class="input" required>
                    <option value=""></option>
                    <option value="">Male</option>
                    <option value="">Female</option>
                </select>
            </div>
            <div class="flex flex-col">
                <label for="size" class="label">Size (in lbs)</label>
                <input type="text" id="size" class="input" required />
            </div>
            <div class="flex flex-col">
                <label for="description" class="label">Description</label>
                <textarea id="description" class="input h-24" required></textarea>
            </div>
            <div class="flex flex-col">
                <label for="medical" class="label">Medical History</label>
                <textarea id="medical" class="input h-24" required></textarea>
            </div>
            <div class="flex flex-col">
                <label for="behaviour" class="label">Behaviour</label>
                <textarea id="behaviour" class="input h-24" required></textarea>
            </div>
            <div class="flex flex-col">
                <label for="special" class="label">Special Needs or Requirements</label>
                <textarea id="special" class="input h-24"></textarea>
            </div>
            <div class="flex flex-col">
                <input type="submit" class="button mx-2 mt-4 mb-2" value="Create Pet Listing" />
            </div>
        </form>
    </>
}

export default ListingForm