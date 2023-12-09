import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { fetchWithAuthorization } from '../../fetch';
import { useAuth } from '../../contexts/TokenContext';

const ListingForm = ({ initialValues, create }) => {
    const [formData, setFormData] = useState(initialValues);

    const navigate = useNavigate();

    const { token } = useAuth();

    useEffect(() => {
        setFormData(initialValues);
      }, [initialValues]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFormData({
            ...formData,
            images: selectedFiles
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });
        if (formData.images) {
            formData.images.forEach((image, index) => {
                form.append('images', image);
            });
        }
        
        if (create) {
            fetchWithAuthorization(`/listings/listing/`, {method: 'POST', body: form}, navigate, token)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                console.log(response.json()); // Parse the JSON data
            })
            .then(data => {
                // Handle the response data
                console.log('Success:', data);
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
        }
        else {
            fetch(`http://127.0.0.1:8000/listings/listing/${formData.listingID}/`, {method: 'PATCH', body: form, headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxODMwMjMxLCJpYXQiOjE3MDE4MDg2MzEsImp0aSI6Ijg0NjZjY2U1MmU0NTRhNjQ5ZjY0NDI1NzFhOGFiNTJjIiwidXNlcl9pZCI6M30.Avuyyn7dDxSWButsUDNjUldCNDEUQL8iSawF8uj5OZM'}})
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                console.log(response.json()); // Parse the JSON data
            })
            .then(data => {
                // Handle the response data
                console.log('Success:', data);
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
        }
      };

    return <>
        <form onSubmit={handleSubmit} class="grid grid-cols-1 w-10/12 xl:w-3/4 2xl:w-2/4 max-w-[836px] p-6 rounded-md border-blue3 border-4 bg-blue2">
            <div class="flex flex-col">
                <label for="name" class="label">Status</label>
                <select id="status" name="status" class="input" value={formData.status} onChange={handleInputChange} required>
                    <option value="available">Available</option>
                    <option value="adopted">Adopted</option>
                    <option value="pending">Pending</option>
                    <option value="withdrawn">Withdrawn</option>
                </select>
            </div>
            <div class="flex flex-col">
                <label for="name" class="label">Pet Name</label>
                <input type="text" id="name" class="input box-border" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div class="flex flex-col">
                <label for="photo" class="label">Photos</label>
                <input type="file" id="photo" class="input bg-white p-6" name="images" onChange={handleImageInput} multiple />
            </div>
            <div class="flex flex-col">
                <label for="species" class="label">Species</label>
                <input type="text" id="species" class="input" name="species" value={formData.species} onChange={handleInputChange} required />
            </div>
            <div class="flex flex-col">
                <label for="breed" class="label">Breed</label>
                <input type="text" id="breed" class="input" name="breed" value={formData.breed} onChange={handleInputChange} required />
            </div>
            <div class="flex flex-col">
                <label for="age" class="label">Age (Years)</label>
                <input type="number" id="age" class="input" name="years_old" value={formData.years_old} onChange={handleInputChange} />
            </div>
            <div class="flex flex-col">
                <label for="age" class="label">Age (Months)</label>
                <input type="number" id="age" class="input" name="months_old" value={formData.months_old} onChange={handleInputChange} />
            </div>
            <div class="flex flex-col">
                <label for="gender" class="label">Gender</label>
                <select id="gender" name="gender" class="input" value={formData.gender} onChange={handleInputChange} required>
                    <option value=""></option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div class="flex flex-col">
                <label for="size" class="label">Size (in lbs)</label>
                <input type="number" id="size" class="input" name="size" value={formData.size} onChange={handleInputChange} required />
            </div>
            <div class="flex flex-col">
                <label for="description" class="label">Description</label>
                <textarea id="description" class="input h-24" name="description" value={formData.description} onChange={handleInputChange}></textarea>
            </div>
            <div class="flex flex-col">
                <label for="medical" class="label">Medical History</label>
                <textarea id="medical" class="input h-24" name="medical_history" value={formData.medical_history} onChange={handleInputChange}></textarea>
            </div>
            <div class="flex flex-col">
                <label for="behaviour" class="label">Behaviour</label>
                <textarea id="behaviour" class="input h-24" name="behaviour" value={formData.behaviour} onChange={handleInputChange}></textarea>
            </div>
            <div class="flex flex-col">
                <label for="special" class="label">Special Needs or Requirements</label>
                <textarea id="special" class="input h-24" name="special_requirements" value={formData.special_requirements} onChange={handleInputChange}></textarea>
            </div>
            <div class="flex flex-col">
                <input type="submit" class="button mx-2 mt-4 mb-2" value={create === true ? "Create Pet Listing" : "Update Pet Listing"} />
            </div>
        </form>
    </>
}

export default ListingForm