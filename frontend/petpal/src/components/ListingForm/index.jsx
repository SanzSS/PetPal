import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { fetchWithAuthorization } from '../../fetch';
import { useAuth } from '../../contexts/TokenContext';

const ListingForm = ({ initialValues, create }) => {
    const [formData, setFormData] = useState(initialValues);
    const [error, setError] = useState("");

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
                    return response.json().then(errorData => {
                        throw new Error(JSON.stringify(errorData));
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                setError(JSON.parse(error.message));
            });
        }
        else {
            fetchWithAuthorization(`/listings/listing/${formData.listingID}/`, {method: 'PATCH', body: form}, navigate, token)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(JSON.stringify(errorData));
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                setError(JSON.parse(error.message));
            });
        }
      };

    return <>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 w-10/12 xl:w-3/4 2xl:w-2/4 max-w-[836px] p-6 rounded-md border-blue3 border-4 bg-blue2">
            <div className="flex flex-col">
                <label for="name" className="label">Status</label>
                <select id="status" name="status" className="input" value={formData.status} onChange={handleInputChange} required>
                    <option value="available">Available</option>
                    <option value="adopted">Adopted</option>
                    <option value="pending">Pending</option>
                    <option value="withdrawn">Withdrawn</option>
                    {error?.status && <p className="text-red-500 ml-[0.5rem]">{error.status[0]}</p>}
                </select>
            </div>
            <div className="flex flex-col">
                <label for="name" className="label">Pet Name</label>
                <input type="text" id="name" className="input box-border" name="name" value={formData.name} onChange={handleInputChange} required />
                {error?.name && <p className="text-red-500 ml-[0.5rem]">{error.name[0]}</p>}
            </div>
            <div className="flex flex-col">
                <label for="photo" className="label">Photos</label>
                <input type="file" id="photo" className="input bg-white p-6" name="images" onChange={handleImageInput} multiple />
            </div>
            <div className="flex flex-col">
                <label for="species" className="label">Species</label>
                <input type="text" id="species" className="input" name="species" value={formData.species} onChange={handleInputChange} required />
                {error?.species && <p className="text-red-500 ml-[0.5rem]">{error.species[0]}</p>}
            </div>
            <div className="flex flex-col">
                <label for="breed" className="label">Breed</label>
                <input type="text" id="breed" className="input" name="breed" value={formData.breed} onChange={handleInputChange} required />
                {error?.breed && <p className="text-red-500 ml-[0.5rem]">{error.breed[0]}</p>}
            </div>
            <div className="flex flex-col">
                <label for="age" className="label">Age (Years)</label>
                <input type="number" id="age" className="input" name="years_old" value={formData.years_old} onChange={handleInputChange} />
                {error?.years_old && <p className="text-red-500 ml-[0.5rem]">{error.years_old[0]}</p>}
            </div>
            <div className="flex flex-col">
                <label for="age" className="label">Age (Months)</label>
                <input type="number" id="age" className="input" name="months_old" value={formData.months_old} onChange={handleInputChange} />
                {error?.months_old && <p className="text-red-500 ml-[0.5rem]">{error.months_old[0]}</p>}
                {!formData.months_old && !formData.years_old && <p className="text-red-500 ml-[0.5rem]">At least one of months_old or years_old must be greater than 0.</p>}
            </div>
            <div className="flex flex-col">
                <label for="gender" className="label">Gender</label>
                <select id="gender" name="gender" className="input" value={formData.gender} onChange={handleInputChange} required>
                    <option value=""></option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                {error?.gender && <p className="text-red-500 ml-[0.5rem]">{error.gender[0]}</p>}
            </div>
            <div className="flex flex-col">
                <label for="size" className="label">Size (in lbs)</label>
                <input type="number" id="size" className="input" name="size" value={formData.size} onChange={handleInputChange} required />
                {error?.size && <p className="text-red-500 ml-[0.5rem]">{error.size[0]}</p>}
            </div>
            <div className="flex flex-col">
                <label for="description" className="label">Description</label>
                <textarea id="description" className="input h-24" name="description" value={formData.description} onChange={handleInputChange}></textarea>
            </div>
            <div className="flex flex-col">
                <label for="medical" className="label">Medical History</label>
                <textarea id="medical" className="input h-24" name="medical_history" value={formData.medical_history} onChange={handleInputChange}></textarea>
            </div>
            <div className="flex flex-col">
                <label for="behaviour" className="label">Behaviour</label>
                <textarea id="behaviour" className="input h-24" name="behaviour" value={formData.behaviour} onChange={handleInputChange}></textarea>
            </div>
            <div className="flex flex-col">
                <label for="special" className="label">Special Needs or Requirements</label>
                <textarea id="special" className="input h-24" name="special_requirements" value={formData.special_requirements} onChange={handleInputChange}></textarea>
            </div>
            <div className="flex flex-col">
                <input type="submit" className="button mx-2 mt-4 mb-2 cursor-pointer" value={create === true ? "Create Pet Listing" : "Update Pet Listing"} />
            </div>
        </form>
    </>
}

export default ListingForm