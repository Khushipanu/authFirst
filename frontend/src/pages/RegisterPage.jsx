import { useState } from "react";
import { registerUser } from "../api/authApi";

export const RegisterPage=()=>{
    const [formData,setFormData]=useState({
        email:"",
        password:"",
        confirmPassword:""
    })

      const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });
  
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
    

    setStatus((currentStatus) => ({
      ...currentStatus,
      error: "",
      success: "",
    }));
  }
  async function handleSubmit(event) {
    event.preventDefault();

    setStatus({
      loading: false,
      error: "",
      success: "",
    });
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!email || !password || !confirmPassword) {
      setStatus({
        loading: false,
        error: "Please fill in all fields",
        success: "",
      });

      return;
    }

    if (password.length < 8) {
      setStatus({
        loading: false,
        error: "Password must contain at least 8 characters",
        success: "",
      });

      return;
    }

    if (password !== confirmPassword) {
      setStatus({
        loading: false,
        error: "Passwords do not match",
        success: "",
      });

      return;
    }

    try {
      setStatus({
        loading: true,
        error: "",
        success: "",
      });

      const data = await registerUser({
        email,
        password,
      });

      setStatus({
        loading: false,
        error: "",
        success:
          data.message || "Account created successfully",
      });

      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setStatus({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
        success: "",
      });
    }
  }



    return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your details to create a new account
          </p>
        </header>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={status.loading}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              disabled={status.loading}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter your password again"
              autoComplete="new-password"
              disabled={status.loading}
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
          </div>

          {status.error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {status.error}
            </div>
          )}

          {status.success && (
            <div
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {status.success}
            </div>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.loading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}