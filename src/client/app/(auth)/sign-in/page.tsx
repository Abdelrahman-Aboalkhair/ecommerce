"use client";
import { useForm } from "react-hook-form";
import Input from "@/app/components/atoms/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MainLayout from "@/app/components/templates/MainLayout";
import { Loader2 } from "lucide-react";
import { useSignInMutation } from "@/app/store/apis/AuthApi";
import GoogleIcon from "@/app/assets/icons/google.png";
import FacebookIcon from "@/app/assets/icons/facebook.png";
import TwitterIcon from "@/app/assets/icons/twitter.png";
import Image from "next/image";
import { AUTH_API_BASE_URL } from "@/app/lib/constants/config";

interface InputForm {
  email: string;
  password: string;
}

const SignIn = () => {
  const [signIn, { error, isLoading }] = useSignInMutation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InputForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: InputForm) => {
    try {
      await signIn(formData).unwrap();
      router.push("/");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    console.log("Using AUTH API URL:", AUTH_API_BASE_URL);
    window.location.href = `${AUTH_API_BASE_URL}/auth/${provider}`;
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <main className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-6">
            Sign In
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 text-center text-sm p-3 rounded mb-4">
              An unexpected error occurred
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              name="email"
              type="text"
              placeholder="Email"
              control={control}
              validation={{ required: "Email is required" }}
              error={errors.email?.message}
              className="py-2.5 text-sm"
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              control={control}
              validation={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              }}
              error={errors.password?.message}
              className="py-2.5 text-sm"
            />

            <Link
              href="/password-reset"
              className="block text-sm text-indigo-600 hover:underline mb-4"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              className={`w-full py-2.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors ${
                isLoading ? "cursor-not-allowed bg-gray-400" : ""
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" size={20} />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-indigo-600 hover:underline">
              Sign up
            </Link>
          </div>

          {/* Testing Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              🧪 Testing Accounts
            </h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div>
                <strong>Superadmin:</strong> superadmin@example.com /
                password123
              </div>
              <div>
                <strong>Admin:</strong> admin@example.com / password123
              </div>
              <div>
                <strong>User:</strong> user@example.com / password123
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              These accounts have different permissions for testing various
              features.
            </p>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              {
                provider: "google",
                icon: GoogleIcon,
                label: "Sign in with Google",
              },
              {
                provider: "facebook",
                icon: FacebookIcon,
                label: "Sign in with Facebook",
              },
              {
                provider: "twitter",
                icon: TwitterIcon,
                label: "Sign in with X",
              },
            ].map(({ provider, icon, label }) => (
              <button
                key={provider}
                onClick={() => handleOAuthLogin(provider)}
                className="w-full py-3 border-2 border-gray-100 bg-transparent text-black rounded-md font-medium hover:bg-gray-50
                 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Image width={20} height={20} src={icon} alt={provider} />
                {label}
              </button>
            ))}
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default SignIn;
