

export default function Register() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl text-center">
                <div className="w-3/5 p-5">
                  <div className="text-left font-bold">
                    <span className="text-blue-500">Logo</span>Ipsum
                  </div>
                  <div className="py-10">
                    <h2 className="text-3xl font-bold text-blue-500 mb-2">Log in to Account</h2>
                    <div className="border-2 w-10 border-blue-500 inline-block mb-2"></div>
                    <p className="text-1xl font-bold my-3">Hello, Welcome Back 👋</p>
                    <p className="text-gray-500 my-3">Log in to your account to read and manage articles.</p>
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                            <input type="email" name="email" placeholder="Email Address" className="bg-gray-100 outline-none text-sm flex-1"/>
                        </div>
                        <div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
                            <input type="password" name="password" placeholder="Password" className="bg-gray-100 outline-none text-sm flex-1"/>
                        </div>
                        {/* <div className="flex justify-between w-64 mb-5">
                            <label className="flex items-center text-xs"><input type="checkbox" name="remember" className="mr-1"/>Remember Me</label>
                            <a href="#" className="text-xs">Forgot Password</a>
                        </div> */}
                        <a href="#" className="border-2 border-blue-500 text-blue-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-500 hover:text-white">Log In</a>
                    </div>
                  </div>
                </div>{" "}
                {/*sign in form*/}
                <div className="w-2/5 bg-blue-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
                  <h2 className="text-3xl font-bold mb-2">Hello, User!</h2>
                  <div className="border-2 w-10 border-white inline-block mb-2"></div>
                  <p className="mb-2">Fill up personal information and start journey with us</p>
                  <a href="#" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-500">Register</a>
                </div>{" "}
                {/*sign up form*/}
              </div>
    </main>
  );
}