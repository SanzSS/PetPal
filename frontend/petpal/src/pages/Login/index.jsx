import './style.css';

const Login = () => {
    return <>
        <main>
          <div className="container" id="content">
            <h1 id="website-name" className="text-teal-900 font-bold text-6xl pt-20">PetPal</h1>
            <br/>
            <br/>
            <form action="../search/search-seeker.html">
                <input type="email" id="form-email" name="email" placeholder="Email" className="p-3 border border-solid border-teal-900 border-2 rounded-md" required/>
                <br/>
                <br/>
                <input type="password" id="password" name="password" placeholder="Password" className="p-3 border border-solid border-teal-900 border-2 rounded-md" required/> 
                <br/>
                <br/>
                <input type="submit" value="Login" id="login" className="w-full p-3 rounded-md font-bold text-lg border-solid border-yellow-400 border-2 cursor-pointer p-3 justify-center inline-flex items-center no-underline text-center"/>
                <br/>
                <br/>
            </form>
            <details className="mb-1">
                <summary id="forgot" className="flex items-center cursor-pointer mb-1">Forgot password?</summary>
                <p className="text-center">Aw man :&#40;</p>
            </details>
            <a href="login-shelter.html" className="text-teal-900 text-base underline mb-1">Shelter?</a>
            <br></br>
            <a href="signup.html" className="text-teal-900 text-base underline mb-20">Sign up</a>
        </div>
      </main>
    </>
}

export default Login